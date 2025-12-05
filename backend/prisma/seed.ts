import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create users
  const nickFury = await prisma.user.upsert({
    where: { email: 'nick.fury@shield.com' },
    update: {},
    create: {
      email: 'nick.fury@shield.com',
      password: hashedPassword,
      name: 'Nick Fury',
      role: 'ADMIN',
      country: 'INDIA',
    },
  });

  const captainMarvel = await prisma.user.upsert({
    where: { email: 'carol.danvers@shield.com' },
    update: {},
    create: {
      email: 'carol.danvers@shield.com',
      password: hashedPassword,
      name: 'Captain Marvel',
      role: 'MANAGER',
      country: 'INDIA',
    },
  });

  const captainAmerica = await prisma.user.upsert({
    where: { email: 'steve.rogers@shield.com' },
    update: {},
    create: {
      email: 'steve.rogers@shield.com',
      password: hashedPassword,
      name: 'Captain America',
      role: 'MANAGER',
      country: 'AMERICA',
    },
  });

  const thanos = await prisma.user.upsert({
    where: { email: 'thanos@shield.com' },
    update: {},
    create: {
      email: 'thanos@shield.com',
      password: hashedPassword,
      name: 'Thanos',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const thor = await prisma.user.upsert({
    where: { email: 'thor@shield.com' },
    update: {},
    create: {
      email: 'thor@shield.com',
      password: hashedPassword,
      name: 'Thor',
      role: 'MEMBER',
      country: 'INDIA',
    },
  });

  const travis = await prisma.user.upsert({
    where: { email: 'travis@shield.com' },
    update: {},
    create: {
      email: 'travis@shield.com',
      password: hashedPassword,
      name: 'Travis',
      role: 'MEMBER',
      country: 'AMERICA',
    },
  });

  console.log('Users created');

  // Create restaurants in India
  const restaurantIndia1 = await prisma.restaurant.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine with a modern twist',
      country: 'INDIA',
      isActive: true,
    },
  });

  const restaurantIndia2 = await prisma.restaurant.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Curry House',
      description: 'Traditional Indian flavors',
      country: 'INDIA',
      isActive: true,
    },
  });

  // Create restaurants in America
  const restaurantAmerica1 = await prisma.restaurant.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Burger Palace',
      description: 'Classic American burgers and fries',
      country: 'AMERICA',
      isActive: true,
    },
  });

  const restaurantAmerica2 = await prisma.restaurant.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440004' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Pizza Paradise',
      description: 'New York style pizza',
      country: 'AMERICA',
      isActive: true,
    },
  });

  console.log('Restaurants created');

  // Delete existing menu items to avoid duplicates
  await prisma.menuItem.deleteMany({});
  console.log('Existing menu items cleared');

  // Create menu items for Spice Garden (India)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantIndia1.id,
        name: 'Butter Chicken',
        description: 'Creamy tomato-based chicken curry',
        price: 350,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with spices',
        price: 280,
        category: 'Appetizer',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Biryani',
        description: 'Aromatic rice with spices and meat',
        price: 400,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Naan',
        description: 'Traditional Indian bread',
        price: 50,
        category: 'Bread',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create menu items for Curry House (India)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantIndia2.id,
        name: 'Dal Makhani',
        description: 'Black lentils in creamy gravy',
        price: 250,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Samosa',
        description: 'Crispy pastry with potato filling',
        price: 80,
        category: 'Appetizer',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Tandoori Chicken',
        description: 'Chicken marinated in yogurt and spices',
        price: 380,
        category: 'Main Course',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create menu items for Burger Palace (America)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce, tomato, and cheese',
        price: 12.99,
        category: 'Burgers',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Cheese Fries',
        description: 'Crispy fries topped with melted cheese',
        price: 6.99,
        category: 'Sides',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Milkshake',
        description: 'Thick and creamy vanilla milkshake',
        price: 5.99,
        category: 'Beverages',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create menu items for Pizza Paradise (America)
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato and mozzarella',
        price: 14.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with pepperoni slices',
        price: 16.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with Caesar dressing',
        price: 8.99,
        category: 'Salads',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Menu items created');

  // Create payment methods for all users
  const paymentMethods = [
    {
      userId: nickFury.id,
      type: 'CREDIT_CARD' as const,
      cardNumber: '4111111111111111',
      cardHolderName: 'Nick Fury',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      userId: captainMarvel.id,
      type: 'CREDIT_CARD' as const,
      cardNumber: '4111111111111112',
      cardHolderName: 'Captain Marvel',
      expiryDate: '12/26',
      isDefault: true,
    },
    {
      userId: captainAmerica.id,
      type: 'CREDIT_CARD' as const,
      cardNumber: '4111111111111113',
      cardHolderName: 'Captain America',
      expiryDate: '12/27',
      isDefault: true,
    },
    {
      userId: thanos.id,
      type: 'CREDIT_CARD' as const,
      cardNumber: '4111111111111114',
      cardHolderName: 'Thanos',
      expiryDate: '12/28',
      isDefault: true,
    },
    {
      userId: thor.id,
      type: 'CREDIT_CARD' as const,
      cardNumber: '4111111111111115',
      cardHolderName: 'Thor',
      expiryDate: '12/29',
      isDefault: true,
    },
    {
      userId: travis.id,
      type: 'CREDIT_CARD' as const,
      cardNumber: '4111111111111116',
      cardHolderName: 'Travis',
      expiryDate: '12/30',
      isDefault: true,
    },
  ];

  // Delete existing payment methods and create new ones
  await prisma.paymentMethod.deleteMany({});
  await prisma.paymentMethod.createMany({
    data: paymentMethods,
    skipDuplicates: true,
  });

  console.log('Payment methods created');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
