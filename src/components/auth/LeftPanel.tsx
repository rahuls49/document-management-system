import { FileText, Shield, Users } from "lucide-react";

export default function LeftPanel() {
    return (
        <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 w-1/2 p-12 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute bottom-20 right-16 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-12 py-16 shadow-2xl border border-white/20 relative z-10 max-w-md">
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/30 p-4 rounded-full">
                            <FileText className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                        Document Management System
                    </h1>

                    {/* Description */}
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                        Securely manage, organize, and access your documents with ease.
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-3 text-left">
                        <div className="flex items-center text-white/80">
                            <Shield className="h-5 w-5 mr-3 text-white" />
                            <span className="text-sm">Secure & Encrypted</span>
                        </div>
                        <div className="flex items-center text-white/80">
                            <Users className="h-5 w-5 mr-3 text-white" />
                            <span className="text-sm">Team Collaboration</span>
                        </div>
                        <div className="flex items-center text-white/80">
                            <FileText className="h-5 w-5 mr-3 text-white" />
                            <span className="text-sm">Easy Organization</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}