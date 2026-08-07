import type { MathRepository } from "@/repositories/math.repository.ts";

export class MathService {
  constructor(private mathRepository: MathRepository) {}

  calcSum({ n1, n2 }: { n1: string | number; n2: string | number }) {
    return this.mathRepository.sum(Number(n1), Number(n2));
  }
}
