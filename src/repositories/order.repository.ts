import Order from "../models/order.model";
import User from "../models/user.model";

class OrderRepository {
  public async findAll(): Promise<Order[]> {
    return Order.findAll({ attributes: { exclude: ["userId", "comment"] } });
  }

  public async findByUserId(userId: number): Promise<Order[]> {
    return Order.findAll({ where: { userId } });
  }

  public async create(order: Order): Promise<Order> {
    return Order.create(order);
  }

  public async findById(id: number): Promise<Order | null> {
    return Order.findByPk(id, { include: [User] });
  }

  public async update(
    orderData: Partial<Order>,
    id: number
  ): Promise<Order | null> {
    const order = await Order.findByPk(id);
    if (order) {
      return order.update(orderData);
    }
    return null;
  }
}

export default new OrderRepository();
