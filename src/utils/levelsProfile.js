import {Crown, Shield, Shirt, Sparkles, Swords, User, Wand2} from "lucide-react";

export const levels = [
    { name: "Muggle Beginner", threshold: 0, maxExercises: 10, icon: User, color: "bg-gray-500" },
    { name: "First-Year Wizard", threshold: 10, maxExercises: 25, icon: Wand2, color: "bg-blue-500" },
    { name: "Quidditch Apprentice", threshold: 25, maxExercises: 50, icon: Shirt, color: "bg-green-500" },
    { name: "Triwizard Competitor", threshold: 50, maxExercises: 100, icon: Swords, color: "bg-yellow-500" },
    { name: "Order of Phoenix Member", threshold: 100, maxExercises: 200, icon: Shield, color: "bg-purple-500" },
    { name: "Half-Blood Prince", threshold: 200, maxExercises: 300, icon: Crown, color: "bg-red-500" },
    { name: "Master of Death", threshold: 300, maxExercises: 500, icon: Sparkles, color: "bg-black" }
];