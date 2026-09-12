"use client";

import { useState } from "react";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Avatar, Box, Button, useTheme } from "@mui/material";
import { apiPost } from "@/libs/apiClient";

interface AvatarProps {
	userId: string;
	displayName: string;
	variant?: "self" | "detail" | "admin";
}

export default function ProfileAvatar({
	userId,
	displayName,
	variant = "self",
}: AvatarProps) {
	const theme = useTheme();

	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [avatarUploading, setAvatarUploading] = useState(false);

	const handleAvatarChange = async (file: File | undefined) => {
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("画像ファイルを選択してください");
			return;
		}

		try {
			setAvatarUploading(true);

			const formData = new FormData();
			formData.append("avatar", file);

			const res = await fetch(
				`${process.env.NEXT_PUBLIC_RESOURCE_API_URL}/users/${userId}/avatar`,
				{
					method: "POST",
					body: formData,
				},
			);

			if (!res.ok) {
				console.error("ステータス:", res.status);

				const text = await res.text();
				console.error("レスポンス:", text);

				throw new Error("アイコンのアップロードに失敗しました");
			}

			const data: { avatarUrl: string } = await res.json();

			setAvatarUrl(data.avatarUrl);
		} catch (error) {
			console.error("アイコンアップロードエラー:", error);
			alert("アイコンのアップロードに失敗しました");
		} finally {
			setAvatarUploading(false);
		}
	};

	return (
		<Box sx={{ position: "relative", flexShrink: 0 }}>
			<Avatar
				src={
					avatarUrl ??
					`${process.env.NEXT_PUBLIC_RESOURCE_API_URL}/users/${userId}/avatar`
				}
				alt={displayName}
				sx={{
					width: 80,
					height: 80,
					fontSize: "2rem",
					bgcolor: theme.palette.primary.main,
				}}
			>
				{displayName.charAt(0).toUpperCase()}
			</Avatar>

			{(variant === "self" || variant === "admin") && (
				<>
					<input
						id="profile-avatar-upload"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						hidden
						disabled={avatarUploading}
						onChange={(event) => {
							void handleAvatarChange(event.target.files?.[0]);
							event.target.value = "";
						}}
					/>

					<label htmlFor="profile-avatar-upload">
						<Button
							component="span"
							variant="contained"
							disabled={avatarUploading}
							sx={{
								position: "absolute",
								right: -4,
								bottom: -4,
								minWidth: 32,
								width: 32,
								height: 32,
								p: 0,
								borderRadius: "50%",
							}}
						>
							<CameraAltIcon fontSize="small" />
						</Button>
					</label>
				</>
			)}
		</Box>
	);
}
