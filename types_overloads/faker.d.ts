export { };

declare global {
    namespace Faker {
        interface FakerStatic {
            unique<T extends (...args: any) => any>(
                method: T,
                args?: Parameters<T>,
                opts?: { maxTime?: number | undefined; maxRetries?: number | undefined, exclude: any[] },
            ): ReturnType<T>;
        }
    }

}