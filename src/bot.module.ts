import { DiscoveryModule } from "@nestjs-plus/discovery";
import { Module, OnModuleInit } from "@nestjs/common";

@Module({
	imports: [DiscoveryModule],
	providers: [],
	exports: [],
})
export class BotModule implements OnModuleInit {
	onModuleInit() {
		throw new Error("Method not implemented.");
	}
}
