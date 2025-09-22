
"use client";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export default function Navbar() {
		return (
			<nav className={cn("w-full bg-white shadow flex items-center justify-between px-6 py-3")}> 
				<div className="flex items-center gap-2">
					<Label className="text-lg font-bold">MyApp</Label>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="ghost">Home</Button>
					<Button variant="ghost">About</Button>
					<Button variant="ghost">Contact</Button>
					<Avatar>
						<AvatarImage src="/file.svg" alt="User" />
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
				</div>
			</nav>
		);
}