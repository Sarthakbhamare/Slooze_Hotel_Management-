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

  // Create menu items for Spice Garden (India) - Authentic Indian Cuisine
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantIndia1.id,
        name: 'Butter Chicken',
        description: 'Tender chicken in creamy tomato-based curry with aromatic spices',
        price: 450,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Paneer Tikka Masala',
        description: 'Grilled cottage cheese cubes in rich tomato gravy',
        price: 380,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice layered with spiced chicken and herbs',
        price: 420,
        category: 'Rice & Biryani',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Vegetable Samosa',
        description: 'Crispy pastry filled with spiced potatoes and peas (2 pcs)',
        price: 120,
        category: 'Appetizer',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Garlic Naan',
        description: 'Soft flatbread brushed with garlic butter',
        price: 80,
        category: 'Bread',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Dal Tadka',
        description: 'Yellow lentils tempered with cumin and spices',
        price: 280,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink blended with sweet mangoes',
        price: 150,
        category: 'Beverages',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia1.id,
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in rose-flavored syrup (3 pcs)',
        price: 180,
        category: 'Dessert',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create menu items for Curry House (India) - Traditional Flavors
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantIndia2.id,
        name: 'Dal Makhani',
        description: 'Slow-cooked black lentils in creamy butter and tomato gravy',
        price: 320,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Tandoori Chicken',
        description: 'Chicken marinated in yogurt and spices, grilled in tandoor',
        price: 480,
        category: 'Tandoor Specials',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Palak Paneer',
        description: 'Cottage cheese cubes in smooth spinach gravy',
        price: 350,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Chicken Tikka',
        description: 'Boneless chicken pieces marinated and grilled (6 pcs)',
        price: 380,
        category: 'Appetizer',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Mutton Rogan Josh',
        description: 'Tender mutton cooked in aromatic Kashmiri spices',
        price: 550,
        category: 'Main Course',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Vegetable Biryani',
        description: 'Basmati rice cooked with mixed vegetables and aromatic spices',
        price: 320,
        category: 'Rice & Biryani',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Butter Naan',
        description: 'Traditional leavened bread brushed with butter',
        price: 60,
        category: 'Bread',
        isAvailable: true,
      },
      {
        restaurantId: restaurantIndia2.id,
        name: 'Raita',
        description: 'Cooling yogurt with cucumber and spices',
        price: 100,
        category: 'Sides',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create menu items for Burger Palace (America) - Classic American
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Classic Cheeseburger',
        description: 'Angus beef patty with cheddar, lettuce, tomato, onion, and pickles',
        price: 14.99,
        category: 'Burgers',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'BBQ Bacon Burger',
        description: 'Double beef patty with crispy bacon, BBQ sauce, and onion rings',
        price: 18.99,
        category: 'Burgers',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Veggie Burger',
        description: 'Plant-based patty with avocado, lettuce, and special sauce',
        price: 13.99,
        category: 'Burgers',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Loaded Cheese Fries',
        description: 'Crispy fries topped with melted cheese, bacon, and jalapeños',
        price: 8.99,
        category: 'Sides',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Onion Rings',
        description: 'Golden-fried onion rings with ranch dipping sauce',
        price: 6.99,
        category: 'Sides',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Chicken Wings',
        description: 'Crispy wings tossed in Buffalo or BBQ sauce (8 pcs)',
        price: 11.99,
        category: 'Appetizer',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Chocolate Milkshake',
        description: 'Thick and creamy milkshake with premium vanilla ice cream',
        price: 6.99,
        category: 'Beverages',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica1.id,
        name: 'Apple Pie',
        description: 'Warm apple pie with cinnamon and vanilla ice cream',
        price: 7.99,
        category: 'Dessert',
        isAvailable: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create menu items for Pizza Paradise (America) - New York Style
  await prisma.menuItem.createMany({
    data: [
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil',
        price: 16.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Pepperoni Pizza',
        description: 'Traditional pizza loaded with pepperoni slices',
        price: 18.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Supreme Pizza',
        description: 'Loaded with pepperoni, sausage, peppers, onions, and olives',
        price: 21.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
        price: 19.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Veggie Delight Pizza',
        description: 'Fresh vegetables with mushrooms, peppers, onions, and olives',
        price: 17.99,
        category: 'Pizza',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, and Caesar dressing',
        price: 9.99,
        category: 'Salads',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 5.99,
        category: 'Appetizer',
        isAvailable: true,
      },
      {
        restaurantId: restaurantAmerica2.id,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 8.99,
        category: 'Dessert',
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
