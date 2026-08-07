import type { MathRepository } from "../math.repository.ts";

export class MathTests implements MathRepository {
    sum(n1: number, n2: number) {
        return n1 + n2
    }
}