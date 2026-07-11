import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Register a user' })
	@ApiCreatedResponse({ description: 'User registered successfully.' })
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Login a user' })
	@ApiOkResponse({ description: 'User logged in successfully.' })
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiOkResponse({ description: 'Current user returned successfully.' })
	me(@CurrentUser() user: JwtPayload) {
		return this.authService.me(user.sub);
	}
}
