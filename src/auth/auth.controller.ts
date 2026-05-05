import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({passthrough: true}) res: Response
  ) {
    const { refreshToken, accessToken, ...response } = await this.authService.login(dto)

    this.authService.addRefreshTokenToResponse(res, refreshToken)
    this.authService.addAccessTokenToResponse(res, accessToken)

    return { ...response, accessToken }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(
    @Body() dto: AuthDto,
    @Res({passthrough: true}) res: Response
  ) {
    const { refreshToken, accessToken, ...response } = await this.authService.register(dto)
    this.authService.addRefreshTokenToResponse(res, refreshToken)
    this.authService.addAccessTokenToResponse(res, accessToken)
    return { ...response, accessToken }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const refreshTokenFromCookie = (req as any).cookies[this.authService.REFRESH_TOKEN_NAME]
    
    if(!refreshTokenFromCookie) {
      this.authService.removeRefreshTokenFromResponse(res)
      this.authService.removeAccessTokenFromResponse(res)
      throw new UnauthorizedException('Refresh токен не прошел')
    }

    const { user, ...tokens } = await this.authService.getNewTokens(refreshTokenFromCookie)
    this.authService.addRefreshTokenToResponse(res, tokens.refreshToken)
    this.authService.addAccessTokenToResponse(res, tokens.accessToken)
    return tokens
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res)
    this.authService.removeAccessTokenFromResponse(res)
    return true
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req){}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    const { refreshToken, accessToken, ...response } = await this.authService.validateOAuthLogin(req)
    this.authService.addRefreshTokenToResponse(res, refreshToken)
    this.authService.addAccessTokenToResponse(res, accessToken)

    return res.redirect(
      `${process.env['CLIENT_URL']}/dashboard?accessToken=${accessToken}`
    )
  }

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth(@Req() _req){}



  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    const { refreshToken, accessToken, ...response } = await this.authService.validateOAuthLogin(req)
    this.authService.addRefreshTokenToResponse(res, refreshToken)
    this.authService.addAccessTokenToResponse(res, accessToken)

    return res.redirect(
      `${process.env['CLIENT_URL']}/dashboard?accessToken=${accessToken}`
    )
  }
}
