import Good from "../models/good.model";

export default interface GoodInOrder {
  id: number;
  quantity: number;
  comment?: string;
  datetime?: string;
  good: Good;
}
