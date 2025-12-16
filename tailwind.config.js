@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* LIGHT MODE - Vibrant & Clean */
    --background: 210 40% 98%;    /* Off-white */
    --foreground: 222 47% 11%;    /* Deep Navy */
    
    --card: 0 0% 100%;            /* Pure White */
    --card-foreground: 222 47% 11%;
    
    --primary: 246 80% 60%;       /* Vibrant Purple */
    --primary-foreground: 210 40% 98%;
    
    --secondary: 199 89% 48%;     /* Sky Blue */
    --secondary-foreground: 210 40% 98%;
    
    --muted: 210 40% 93%;         /* Light Gray */
    --muted-foreground: 215 16% 47%;
    
    --accent: 262 83% 58%;        /* Soft Violet */
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 246 80% 60%;
    --radius: 0.75rem;
  }

  .dark:root {
    /* DARK MODE - Deep & Contrast */
    --background: 222 47% 11%;    /* Deep Navy */
    --foreground: 210 40% 98%;    /* Off-white */
    
    --card: 217 33% 17%;          /* Dark Slate */
    --card-foreground: 210 40% 98%;
    
    --primary: 246 80% 60%;       /* Vibrant Purple */
    --primary-foreground: 210 40% 98%;
    
    --secondary: 199 89% 48%;     /* Sky Blue */
    --secondary-foreground: 210 40% 98%;
    
    --muted: 217 33% 22%;         /* Darker Slate */
    --muted-foreground: 215 20% 65%;
    
    --accent: 262 83% 58%;
    --accent-foreground: 210 40% 98%;
    
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;
    
    --border: 217 33% 22%;
    --input: 217 33% 22%;
    --ring: 212 27% 84%;
  }
}