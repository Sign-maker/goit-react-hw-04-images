import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { getImages } from 'servicesApi/servicesApi';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { BigImage } from './BigImage/BigImage';
import { AppContainer } from './App.styled';
import { Loader } from './Loader/Loader';
import { Informer } from './Informer/Informer.styled';
import { STATUS, INIT_REQUEST_PARAMS, INFO_TYPES } from 'configs/constants';

export const App = () => {
  const [searchName, setSearchName] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isNextPage, setIsNextPage] = useState(false);
  const [status, setStatus] = useState(STATUS.idle);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!searchName) return;

    async function fetchImages() {
      try {
        setStatus(STATUS.pending);
        const { hits, totalHits } = await getImages(
          searchName,
          page,
          INIT_REQUEST_PARAMS.perPage
        );
        setImages(state => [...state, ...hits]);
        setIsNextPage(
          page < Math.ceil(totalHits / INIT_REQUEST_PARAMS.perPage)
        );
        setStatus(STATUS.resolved);
      } catch (error) {
        setStatus(STATUS.rejected);
        setError(error);
      }
    }

    fetchImages();
  }, [searchName, page]);

  const onSearchSubmit = query => {
    if (searchName === query) return;

    setSearchName(query);
    setImages([]);
    setPage(1);
  };

  const onLoadMore = () => {
    setPage(state => state + 1);
  };

  const onModalClose = () => {
    setShowModal(false);
  };

  const onCardClick = id => {
    const selectedImage = images.find(image => image.id === id);

    setSelectedImage(selectedImage);
    setShowModal(true);
  };

  const showGallery =
    (status === STATUS.resolved || isNextPage) && images.length > 0;
  const showNoImagesWarning = status === STATUS.resolved && !images.length;
  const showLoader = status === STATUS.pending;
  const showLoadMore = status === STATUS.resolved && isNextPage;
  const showError = status === STATUS.rejected;

  return (
    <AppContainer>
      <Searchbar onSubmit={onSearchSubmit} />
      {showGallery && (
        <ImageGallery images={images} onCardClick={onCardClick} />
      )}
      {showNoImagesWarning && (
        <Informer $infotype={INFO_TYPES.notification}>
          No images found! Try another request.
        </Informer>
      )}
      {showLoader && <Loader />}
      {showLoadMore && <Button onLoadMore={onLoadMore} />}
      {showError && (
        <Informer $infotype={INFO_TYPES.error}>
          {`Oops, something went wrong! ${error.message}`}
        </Informer>
      )}
      {showModal && (
        <Modal onModalClose={onModalClose}>
          <BigImage imageData={selectedImage} />
        </Modal>
      )}
    </AppContainer>
  );
};
