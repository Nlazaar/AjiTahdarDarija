import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  @MaxLength(72)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;
}
