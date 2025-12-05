import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto/payment-method.dto';
import { Role } from '../common/enums';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentMethodDto) {
    // If setting as default, unset other default payment methods
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // Only admin or owner can view payment method
    if (userRole !== Role.ADMIN && paymentMethod.userId !== userId) {
      throw new ForbiddenException('You can only view your own payment methods');
    }

    return paymentMethod;
  }

  async update(id: string, userId: string, userRole: Role, dto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.findOne(id, userId, userRole);

    // Only admin can update payment methods
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update payment methods');
    }

    // If setting as default, unset other default payment methods
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: paymentMethod.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: dto,
    });
  }

  async setDefault(id: string, userId: string) {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (paymentMethod.userId !== userId) {
      throw new ForbiddenException('You can only set your own payment methods as default');
    }

    // Unset other default payment methods
    await this.prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.paymentMethod.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const paymentMethod = await this.findOne(id, userId, userRole);

    // Only admin can delete payment methods
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete payment methods');
    }

    return this.prisma.paymentMethod.delete({
      where: { id },
    });
  }
}
