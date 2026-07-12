import { createOrder } from '@/actions/checkout/action-checkout';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase Server Client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
  createAdminClient: jest.fn(),
}));

describe('Action: createOrder', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }),
      },
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      in: jest.fn().mockResolvedValue({
        data: [{ id: 'prod-1', price: 1000, stock: 10 }],
        error: null,
      }),
      insert: jest.fn().mockReturnThis(),
      select_insert: jest.fn().mockResolvedValue({
        data: { id: 'order-123' },
        error: null,
      }),
      single: jest.fn().mockResolvedValue({
        data: { id: 'order-123' },
        error: null,
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if customer data is invalid', async () => {
    const formData = new FormData();
    formData.append('cartItems', JSON.stringify([{ id: 'prod-1', quantity: 2, price: 1000 }]));
    formData.append('customerName', 'J'); // Too short
    formData.append('customerPhone', '1234'); // Too short
    formData.append('customerAddress', 'Home'); // Too short
    formData.append('paymentMethod', ''); // Empty
    formData.append('totalAmount', '2000');

    const result = await createOrder(formData);

    expect(result).toHaveProperty('error');
    expect(result.success).toBeUndefined();
  });

  it('should return error if cart items exceed the max limit (massive data attack)', async () => {
    const massiveItems = Array.from({ length: 60 }).map((_, i) => ({
      id: `prod-${i}`,
      quantity: 1,
      price: 100,
    }));

    const formData = new FormData();
    formData.append('cartItems', JSON.stringify(massiveItems));
    formData.append('customerName', 'John Doe');
    formData.append('customerPhone', '09123456789');
    formData.append('customerAddress', '123 Main St, Yangon');
    formData.append('paymentMethod', 'cod');
    formData.append('totalAmount', '6000');

    const result = await createOrder(formData);

    expect(result).toEqual({ error: 'You cannot checkout with more than 50 unique items at once.' });
  });
});
