declare interface ApplicationBootContext {
  graphql: {
    Query: [any?]
    Resolvers: [any?]
    Typedefs: [any?]
  }
}

declare interface IDataSource<T> {
  findAll(): Promise<T[]>
  find(query: { [key: string]: any }): Promise<T[]>
  findById(_id: any): Promise<T | undefined>
  create(ins: T): Promise<T>
  update(ins: T): Promise<T>
  delete(_id: any): Promise<void>
}
