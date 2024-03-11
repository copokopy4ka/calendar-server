export interface DateQuery {
  date: { $gte: Date; $lt: Date };
}
