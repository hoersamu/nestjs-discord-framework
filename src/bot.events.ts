import {
	Channel,
	ClientEvents,
	CloseEvent,
	Collection,
	Guild,
	GuildEmoji,
	GuildMember,
	Invite,
	Message,
	MessageReaction,
	PartialDMChannel,
	PartialGuildMember,
	PartialMessage,
	PartialUser,
	Presence,
	RateLimitData,
	Role,
	Speaking,
	TextChannel,
	User,
	VoiceState,
} from "discord.js";

export abstract class BotEvents implements ClientEvents {
	channelCreate: [Channel];
	channelDelete: [Channel | PartialDMChannel];
	channelPinsUpdate: [Channel | PartialDMChannel, Date];
	channelUpdate: [Channel, Channel];
	debug: [string];
	warn: [string];
	disconnect: [any, number];
	emojiCreate: [GuildEmoji];
	emojiDelete: [GuildEmoji];
	emojiUpdate: [GuildEmoji, GuildEmoji];
	error: [Error];
	guildBanAdd: [Guild, User];
	guildBanRemove: [Guild, User];
	guildCreate: [Guild];
	guildDelete: [Guild];
	guildUnavailable: [Guild];
	guildIntegrationsUpdate: [Guild];
	guildMemberAdd: [GuildMember];
	guildMemberAvailable: [GuildMember | PartialGuildMember];
	guildMemberRemove: [GuildMember | PartialGuildMember];
	guildMembersChunk: [
		Collection<string, GuildMember>,
		Guild,
		{ count: number; index: number; nonce: string }
	];
	guildMemberSpeaking: [GuildMember | PartialGuildMember, Readonly<Speaking>];
	guildMemberUpdate: [GuildMember | PartialGuildMember, GuildMember];
	guildUpdate: [Guild, Guild];
	inviteCreate: [Invite];
	inviteDelete: [Invite];
	message: [Message];
	messageDelete: [Message | PartialMessage];
	messageReactionRemoveAll: [Message | PartialMessage];
	messageReactionRemoveEmoji: [MessageReaction];
	messageDeleteBulk: [Collection<string, Message | PartialMessage>];
	messageReactionAdd: [MessageReaction, User | PartialUser];
	messageReactionRemove: [MessageReaction, User | PartialUser];
	messageUpdate: [Message | PartialMessage, Message | PartialMessage];
	presenceUpdate: [Presence, Presence];
	rateLimit: [RateLimitData];
	ready: any;
	invalidated: any;
	roleCreate: [Role];
	roleDelete: [Role];
	roleUpdate: [Role, Role];
	typingStart: [Channel | PartialDMChannel, User | PartialUser];
	userUpdate: [User | PartialUser, User];
	voiceStateUpdate: [VoiceState, VoiceState];
	webhookUpdate: [TextChannel];
	shardDisconnect: [CloseEvent, number];
	shardError: [Error, number];
	shardReady: [number, Set<string>];
	shardReconnecting: [number];
	shardResume: [number, number];
}
