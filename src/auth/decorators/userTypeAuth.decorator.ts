import { SetMetadata } from '@nestjs/common';

export const UserTypeAuth = (...args: string[]) => SetMetadata('userType', args);