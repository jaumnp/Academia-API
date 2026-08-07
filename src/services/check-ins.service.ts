import type { CheckInsRepository } from "../repositories/check-ins.repository.ts";
import type { GymsRepository } from "../repositories/gyms.repository.ts";
import type { UsersRepository } from "../repositories/users.repository.ts";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-beetwen-coordinates.ts";

interface CreateCheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface SearchQuery {
  id?: string | undefined;
  page?: number | undefined;
  qntd?: number | undefined;
}

export class CheckInsService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async index({ id, page, qntd }: SearchQuery) {
    return await this.checkInsRepository.findMany(id, page, qntd);
  }

  async create({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CreateCheckInRequest) {
    const gym = await this.gymsRepository.findById(gymId);
    if (!gym) throw new Error("Academia não existe ou não está registrada!");

    const user = await this.usersRepository.findById(userId);
    if (!user) throw new Error("Usuário não existe!");

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
    );

    if (distance > 0.1) throw new Error("Você está muito longe da academia!");

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );
    if (checkInOnSameDay) throw new Error("Você já realizou um check-in hoje!");

    return await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });
  }

  async delete({ checkIn_id }: { checkIn_id: string }) {
    return await this.checkInsRepository.delete(checkIn_id);
  }
}
