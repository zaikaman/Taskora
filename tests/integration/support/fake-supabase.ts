type RowRecord = Record<string, unknown>;

interface QueryResult<T> {
  data: T | null;
  error: { message: string } | null;
}

type TableStore = Record<string, RowRecord[]>;

class FakeAuth {
  public constructor(private readonly userId: string) {}

  public async getUser(): Promise<{ data: { user: { id: string } | null }; error: null }> {
    return {
      data: {
        user: {
          id: this.userId
        }
      },
      error: null
    };
  }
}

class FakeQueryBuilder<T extends RowRecord> implements PromiseLike<QueryResult<T | T[]>> {
  private filters: Array<{ column: string; value: unknown }> = [];
  private sortColumn?: string;
  private ascending = true;
  private singleRow = false;
  private insertPayload?: RowRecord[];
  private updatePayload?: RowRecord;
  private upsertPayload?: RowRecord[];

  public constructor(
    private readonly tableName: string,
    private readonly store: TableStore
  ) {}

  public select(): this {
    return this;
  }

  public insert(payload: RowRecord | RowRecord[]): this {
    this.insertPayload = Array.isArray(payload) ? payload : [payload];
    return this;
  }

  public update(payload: RowRecord): this {
    this.updatePayload = payload;
    return this;
  }

  public upsert(payload: RowRecord | RowRecord[]): this {
    this.upsertPayload = Array.isArray(payload) ? payload : [payload];
    return this;
  }

  public eq(column: string, value: unknown): this {
    this.filters.push({ column, value });
    return this;
  }

  public order(column: string, options?: { ascending?: boolean }): this {
    this.sortColumn = column;
    this.ascending = options?.ascending ?? true;
    return this;
  }

  public single(): this {
    this.singleRow = true;
    return this;
  }

  public then<TResult1 = QueryResult<T | T[]>, TResult2 = never>(
    onfulfilled?:
      | ((value: QueryResult<T | T[]>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled ?? undefined, onrejected ?? undefined);
  }

  private async execute(): Promise<QueryResult<T | T[]>> {
    const table = (this.store[this.tableName] ??= []);

    if (this.insertPayload) {
      for (const row of this.insertPayload) {
        table.push({ ...row, id: (row.id as string | undefined) ?? crypto.randomUUID() });
      }
    }

    if (this.upsertPayload) {
      for (const row of this.upsertPayload) {
        const id = row.id as string | undefined;
        const existingIndex = id ? table.findIndex((item) => item.id === id) : -1;

        if (existingIndex >= 0) {
          table[existingIndex] = { ...table[existingIndex], ...row };
        } else {
          table.push({ ...row });
        }
      }
    }

    let rows = [...table];

    if (this.updatePayload) {
      rows = rows.map((row) => {
        const matches = this.filters.every((filter) => row[filter.column] === filter.value);
        return matches ? { ...row, ...this.updatePayload } : row;
      });
      this.store[this.tableName] = rows;
    }

    rows = rows.filter((row) => this.filters.every((filter) => row[filter.column] === filter.value));

    if (this.sortColumn) {
      rows.sort((left, right) => {
        const leftValue = left[this.sortColumn ?? ""];
        const rightValue = right[this.sortColumn ?? ""];

        if (leftValue === rightValue) {
          return 0;
        }

        const direction = this.ascending ? 1 : -1;
        return leftValue! > rightValue! ? direction : -direction;
      });
    }

    if (this.singleRow) {
      return {
        data: (rows[0] as T | undefined) ?? null,
        error: rows[0] ? null : { message: `No row found in ${this.tableName}` }
      };
    }

    return {
      data: rows as T[],
      error: null
    };
  }
}

export class FakeSupabaseClient {
  public readonly auth: FakeAuth;
  private readonly store: TableStore;

  public constructor(userId: string, seed: TableStore = {}) {
    this.auth = new FakeAuth(userId);
    this.store = seed;
  }

  public from<T extends RowRecord>(tableName: string): FakeQueryBuilder<T> {
    return new FakeQueryBuilder<T>(tableName, this.store);
  }
}
