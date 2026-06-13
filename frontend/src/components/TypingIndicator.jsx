export default function TypingIndicator(){
    return (
        <div className="flex gap-1 rounded-full bg-muted px-4 py-2">
            <div className="size-2 rounded-full bg-foreground animate-bounce" />
                <div className="size-2 rounded-full bg-foreground animate-bounce"
                    style={{animationDelay: "0.15s"}} />
                <div
                    className="size-2 rounded-full bg-foreground animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                />
        </div>
    )
}