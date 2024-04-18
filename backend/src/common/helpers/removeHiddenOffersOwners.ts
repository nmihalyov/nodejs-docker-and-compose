import { Wish } from 'src/modules/wishes/entities/wish.entity';

export const removeHiddenOffersOwners = function (
  wishes: Wish | Wish[],
  userId?: number,
) {
  const handleWish = (wish: Wish) => {
    wish?.offers?.forEach((offer) => {
      if (!userId || (offer.user?.id !== userId && offer.hidden)) {
        delete offer.user;
      }
    });
  };

  if (Array.isArray(wishes)) {
    wishes.forEach((wish) => {
      handleWish(wish);
    });

    return;
  }

  handleWish(wishes);
};
