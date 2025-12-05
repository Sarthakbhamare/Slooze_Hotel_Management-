import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException,
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Country, Role, OrderStatus } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto, userRole: Role, userCountry: Country) {
    // Verify restaurant exists and user has access
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Check country access (bonus feature)
    if (userRole !== Role.ADMIN && restaurant.country !== userCountry) {
      throw new ForbiddenException('You can only order from restaurants in your country');
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems: { menuItemId: string; quantity: number; price: any }[] = [];

    for (const item of dto.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem || !menuItem.isAvailable) {
        throw new BadRequestException(`Menu item ${item.menuItemId} not available`);
      }

      if (menuItem.restaurantId !== dto.restaurantId) {
        throw new BadRequestException(`Menu item ${item.menuItemId} does not belong to this restaurant`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId: dto.restaurantId,
        totalAmount,
        paymentMethodId: dto.paymentMethodId,
        country: restaurant.country,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItems,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        paymentMethod: true,
      },
    });

    return order;
  }

  async findAll(userId: string, userRole: Role, userCountry: Country) {
    // If admin, return all orders
    if (userRole === Role.ADMIN) {
      return this.prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          restaurant: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              country: true,
            },
          },
          paymentMethod: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // For managers, return orders from their country
    if (userRole === Role.MANAGER) {
      return this.prisma.order.findMany({
        where: {
          country: userCountry,
        },
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          restaurant: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              country: true,
            },
          },
          paymentMethod: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // For members, return only their own orders
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        paymentMethod: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, userRole: Role, userCountry: Country) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            country: true,
          },
        },
        paymentMethod: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check access permissions
    if (userRole === Role.MEMBER && order.userId !== userId) {
      throw new ForbiddenException('You can only view your own orders');
    }

    if (userRole === Role.MANAGER && order.country !== userCountry) {
      throw new ForbiddenException('You can only view orders from your country');
    }

    return order;
  }

  async checkout(id: string, userId: string, userRole: Role, userCountry: Country) {
    const order = await this.findOne(id, userId, userRole, userCountry);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order has already been processed');
    }

    if (!order.paymentMethodId) {
      throw new BadRequestException('Payment method is required');
    }

    // Update order status to confirmed
    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CONFIRMED,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        paymentMethod: true,
      },
    });
  }

  async cancel(id: string, userId: string, userRole: Role, userCountry: Country) {
    const order = await this.findOne(id, userId, userRole, userCountry);

    // Check if user has permission to cancel (only ADMIN and MANAGER)
    if (userRole === Role.MEMBER) {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Cannot cancel a delivered order');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        paymentMethod: true,
      },
    });
  }

  async updateStatus(id: string, newStatus: string, userRole: Role, userCountry: Country) {
    // Only ADMIN and MANAGER can update order status
    if (userRole === Role.MEMBER) {
      throw new ForbiddenException('Members cannot update order status');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Managers can only update orders from their country
    if (userRole === Role.MANAGER && order.country !== userCountry) {
      throw new ForbiddenException('You can only update orders from your country');
    }

    // Validate status transition
    const validStatuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
      throw new BadRequestException('Invalid status');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: newStatus as OrderStatus,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            country: true,
          },
        },
        paymentMethod: true,
      },
    });
  }
}
