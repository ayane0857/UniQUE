const resourceApiUrl = process.env.NEXT_PUBLIC_RESOURCE_API_URL;

const nextConfig: NextConfig = {
	experimental: {
		webpackMemoryOptimizations: true,
		authInterrupts: true,
	},

	output: "standalone",
	poweredByHeader: false,

	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Content-Security-Policy",
						value:
							process.env.NODE_ENV === "production"
								? [
										"default-src 'self'",
										`img-src 'self' https://cdn.discordapp.com ${resourceApiUrl ?? ""}`,
										"base-uri 'self'",
										"frame-ancestors 'none'",
										"object-src 'none'",
										`connect-src 'self' ${resourceApiUrl ?? ""} https://static.cloudflareinsights.com`,
										"script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
										"style-src 'self' 'unsafe-inline'",
									].join("; ")
								: [
										"default-src 'self'",
										`img-src 'self' https://cdn.discordapp.com ${resourceApiUrl ?? ""}`,
										`connect-src 'self' ${resourceApiUrl ?? ""} https://static.cloudflareinsights.com`,
										"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
										"style-src 'self' 'unsafe-inline'",
									].join("; "),
					},
				],
			},
		];
	},
};

export default nextConfig;
