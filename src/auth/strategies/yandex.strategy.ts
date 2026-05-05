import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy,'yandex'){
    constructor(private configService: ConfigService){
        super({
            clientID:configService.get('YANDEX_CLIENT_TO') as string,
            clientSecret: configService.get('YANDEX_CLIENT_SECRET') as string,
            callbackURL: configService.get('SERVER_URL') + '/auth/yandex/callback',
            scope: ['profile', 'email']
                 
        })
    }
    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ) {
        const {username, emails, photos} = profile

        const user = {
            email: emails?.[0]?.value ?? null,
            name: username,
            picture: photos?.[0]?.value ?? null,
            
        }
        done(null, user)
    }
}