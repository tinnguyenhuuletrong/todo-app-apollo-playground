import { find, remove, filter, matches } from 'lodash'

class MemoryConnector<T> implements IDataSource<T> {
  private dataSource: T[] = []

  constructor(source: T[] = []) {
    this.dataSource = source
  }

  public async findAll(): Promise<T[]> {
    return Promise.resolve(this.dataSource)
  }

  public async find(query: { [key: string]: any }): Promise<T[]> {
    return Promise.resolve(filter(this.dataSource, matches(query)))
  }

  public async findById(_id: any): Promise<T | undefined> {
    return Promise.resolve(find(this.dataSource, { _id }) as T)
  }

  public async create(ins: T): Promise<T> {
    this.dataSource.push(ins)
    return Promise.resolve(ins)
  }

  public async update(ins: T): Promise<T> {
    return Promise.resolve(ins)
  }

  public async delete(_id: any): Promise<void> {
    remove(this.dataSource, (itm: any) => itm._id === _id)
  }
}

export function connect<T>(source: T[]): IDataSource<T> {
  return new MemoryConnector<T>(source)
}
