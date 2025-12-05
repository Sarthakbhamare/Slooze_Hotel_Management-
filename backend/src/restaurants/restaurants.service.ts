import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '../common/enums';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: Role, userCountry: Country) {
    // If admin, return all restaurants
    if (userRole === Role.ADMIN) {
      return this.prisma.restaurant.findMany({
        where: { isActive: true },
        include: {
          menuItems: {
            where: { isAvailable: true },
          },
        },
      });
    }

    // For managers and members, filter by country
    return this.prisma.restaurant.findMany({
      where: {
        isActive: true,
        country: userCountry,
      },
      include: {
        menuItems: {
          where: { isAvailable: true },
        },
      },
    });
  }

  async findOne(id: string, userRole: Role, userCountry: Country) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
        },
      },
    });

    // If admin, return restaurant
    if (userRole === Role.ADMIN) {
      return restaurant;
    }

    // For managers and members, check country access
    if (restaurant && restaurant.country !== userCountry) {
      return null; // Or throw ForbiddenException
    }

    return restaurant;
  }

  async getMenuItems(restaurantId: string, userRole: Role, userCountry: Country) {
    // First check if user has access to this restaurant
    const restaurant = await this.findOne(restaurantId, userRole, userCountry);
    
    if (!restaurant) {
      return [];
    }

    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
    });
  }

  async createRestaurant(createDto: any, user: any) {
    // Managers can only create restaurants in their country
    const country = user.role === Role.ADMIN ? createDto.country : user.country;

    return this.prisma.restaurant.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        country,
        isActive: true,
      },
    });
  }

  async updateRestaurant(id: string, updateDto: any, user: any) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Managers can only update restaurants in their country
    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException('You can only update restaurants in your country');
    }

    return this.prisma.restaurant.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteRestaurant(id: string, user: any) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Managers can only delete restaurants in their country
    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException('You can only delete restaurants in your country');
    }

    // Soft delete
    return this.prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createMenuItem(restaurantId: string, createDto: any, user: any) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Managers can only add menu items to restaurants in their country
    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException('You can only add menu items to restaurants in your country');
    }

    return this.prisma.menuItem.create({
      data: {
        restaurantId,
        name: createDto.name,
        description: createDto.description,
        price: createDto.price,
        category: createDto.category,
        isAvailable: true,
      },
    });
  }

  async updateMenuItem(restaurantId: string, menuItemId: string, updateDto: any, user: any) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Managers can only update menu items in their country
    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException('You can only update menu items in your country');
    }

    const menuItem = await this.prisma.menuItem.findUnique({ where: { id: menuItemId } });
    
    if (!menuItem || menuItem.restaurantId !== restaurantId) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data: updateDto,
    });
  }

  async deleteMenuItem(restaurantId: string, menuItemId: string, user: any) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Managers can only delete menu items in their country
    if (user.role === Role.MANAGER && restaurant.country !== user.country) {
      throw new ForbiddenException('You can only delete menu items in your country');
    }

    const menuItem = await this.prisma.menuItem.findUnique({ where: { id: menuItemId } });
    
    if (!menuItem || menuItem.restaurantId !== restaurantId) {
      throw new NotFoundException('Menu item not found');
    }

    // Soft delete
    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data: { isAvailable: false },
    });
  }
}
