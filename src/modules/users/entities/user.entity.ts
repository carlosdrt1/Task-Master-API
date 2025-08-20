import { Provider } from '@/shared/enums/provider.enum';

export class User {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly provider: Provider,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    private readonly password?: string,
  ) {}
}
