import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums';

@Controller('restaurants')
@UseGuards(AuthGuard('jwt'))
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.restaurantsService.findAll(user.role, user.country);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.restaurantsService.findOne(id, user.role, user.country);
  }

  @Get(':id/menu')
  getMenuItems(@Param('id') id: string, @CurrentUser() user: any) {
    return this.restaurantsService.getMenuItems(id, user.role, user.country);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  createRestaurant(@Body() createDto: any, @CurrentUser() user: any) {
    return this.restaurantsService.createRestaurant(createDto, user);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  updateRestaurant(@Param('id') id: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.restaurantsService.updateRestaurant(id, updateDto, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  deleteRestaurant(@Param('id') id: string, @CurrentUser() user: any) {
    return this.restaurantsService.deleteRestaurant(id, user);
  }

  @Post(':id/menu')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  createMenuItem(@Param('id') restaurantId: string, @Body() createDto: any, @CurrentUser() user: any) {
    return this.restaurantsService.createMenuItem(restaurantId, createDto, user);
  }

  @Patch(':restaurantId/menu/:menuItemId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  updateMenuItem(@Param('restaurantId') restaurantId: string, @Param('menuItemId') menuItemId: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.restaurantsService.updateMenuItem(restaurantId, menuItemId, updateDto, user);
  }

  @Delete(':restaurantId/menu/:menuItemId')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  deleteMenuItem(@Param('restaurantId') restaurantId: string, @Param('menuItemId') menuItemId: string, @CurrentUser() user: any) {
    return this.restaurantsService.deleteMenuItem(restaurantId, menuItemId, user);
  }
}
