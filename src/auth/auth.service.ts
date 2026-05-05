import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { CookieOptions } from 'express';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';



@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1
    EXPIRE_HOUR_ACCESS_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'
    ACCESS_TOKEN_NAME = 'accessToken'


    constructor(
        private jwt:JwtService,
         private userService: UserService,
         private prisma: PrismaService,
         private configService: ConfigService
        ){}

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto)
        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email)

        if(oldUser) throw new BadRequestException('Пользователь с таким email уже существует')

        const user = await this.userService.create(dto)

        const tokens = this.issueTokens(user.id)

        return { user, ...tokens }
    }

    async getNewTokens(refreshToken:string) {
        const result = await this.jwt.verifyAsync(refreshToken)
        if(!result) throw new UnauthorizedException('Невалидный refresh token')

        const user = await this.userService.getById(result.id)
        if(!user) throw new NotFoundException('Пользователь не найден')
        const tokens = this.issueTokens(user.id)

        return { user, ...tokens}
    }

    issueTokens(userId:string) {
        const data = {id: userId}

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'

        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        })

        return {accessToken, refreshToken }
    }

    private async validateUser(dto: AuthDto){
        const user = await this.userService.getByEmail(dto.email)

        if(!user) throw new NotFoundException('Пользователь не найден')
        
        return user
    }

    private getRefreshCookieOptions(expires: Date): CookieOptions {
        const isProduction = this.configService.get('NODE_ENV') === 'production'
        const domain = this.configService.get<string>('SERVER_DOMAIN')

        const options: CookieOptions = {
            httpOnly: true,
            expires,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax'
        }

        // Domain for localhost/dev is often omitted to avoid browser rejections.
        if (domain && domain !== 'localhost') {
            options.domain = domain
        }

        return options
    }

    private getAccessCookieOptions(expires: Date): CookieOptions {
        return this.getRefreshCookieOptions(expires)
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, this.getRefreshCookieOptions(expiresIn))
    }

    addAccessTokenToResponse(res: Response, accessToken: string) {
        const expiresIn = new Date()
        expiresIn.setHours(expiresIn.getHours() + this.EXPIRE_HOUR_ACCESS_TOKEN)

        res.cookie(this.ACCESS_TOKEN_NAME, accessToken, this.getAccessCookieOptions(expiresIn))
    }
    
    async validateOAuthLogin(req: any) {
        let user = await this.userService.getByEmail(req.user.email)

        if(!user) {
            user = await this.prisma.user.create({
                data: {
                    email: req.user.email,
                    name: req.user.name,
                    picture: req.user.picture,
                },
                include: {
                    stores: true,
                    favorites: true,
                    orders: true,
                }
            })
        }

        const tokens = this.issueTokens(user.id)

        return {user, ...tokens}
    }

    removeRefreshTokenFromResponse(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', this.getRefreshCookieOptions(new Date(0)))
    }

    removeAccessTokenFromResponse(res: Response) {
        res.cookie(this.ACCESS_TOKEN_NAME, '', this.getAccessCookieOptions(new Date(0)))
    }
}
