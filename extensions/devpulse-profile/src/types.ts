export interface IDevProfile {
	featureUsage: Record<string, number>;
	languageDistribution: Record<string, number>;
	learningVelocity: number;
	preferences: {
		isRusher: boolean;
		usesMindMaps: boolean;
		readsDocs: boolean;
	};
}
