'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

// Lightbox
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

/* ─── styled wrappers ─── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MainSlider = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #F1F5F9;

  .swiper {
    width: 100%;
    aspect-ratio: 16 / 10;
  }

  .swiper-slide {
    cursor: zoom-in;
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    backdrop-filter: blur(4px);
    transition: background 150ms ease;
  }
  .swiper-button-prev:hover,
  .swiper-button-next:hover {
    background: rgba(0, 0, 0, 0.55);
  }
  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 16px;
    font-weight: 900;
  }

  .swiper-pagination-bullet {
    background: #fff;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
    background: var(--accent);
  }
`;

const SlideImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbSlider = styled.div`
  .swiper {
    width: 100%;
    height: 68px;
  }

  .swiper-slide {
    height: 68px !important;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 150ms ease, border-color 150ms ease;
  }

  .swiper-slide-thumb-active {
    border-color: var(--accent);
    opacity: 1;
  }

  .swiper-slide:hover {
    opacity: 0.85;
  }

  @media (max-width: 600px) {
    .swiper {
      height: 52px;
    }
    .swiper-slide {
      height: 52px !important;
    }
  }
`;

const ThumbImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: #F1F5F9;
  color: var(--muted);
  font-size: 14px;
`;

/* ─── component ─── */

export default function Gallery({ images }: { images: string[] }) {
  const list = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  const openLightbox = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
    },
    []
  );

  const lightboxSlides = useMemo(
    () => list.map((src) => ({ src })),
    [list]
  );

  if (!list.length) {
    return <Placeholder>No photos</Placeholder>;
  }

  return (
    <Wrap>
      {/* Main slider */}
      <MainSlider>
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          spaceBetween={0}
          slidesPerView={1}
          loop={list.length > 1}
          onSwiper={(sw) => { mainSwiperRef.current = sw; }}
          onSlideChange={(sw) => setLightboxIndex(sw.realIndex)}
        >
          {list.map((url, i) => (
            <SwiperSlide key={url + i} onClick={() => openLightbox(i)}>
              <SlideImg
                src={url}
                alt={`Photo ${i + 1} of ${list.length}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </MainSlider>

      {/* Thumbnail strip */}
      {list.length > 1 && (
        <ThumbSlider>
          <Swiper
            modules={[FreeMode, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={Math.min(list.length, 8)}
            freeMode
            watchSlidesProgress
            breakpoints={{
              0: { slidesPerView: Math.min(list.length, 5) },
              480: { slidesPerView: Math.min(list.length, 6) },
              768: { slidesPerView: Math.min(list.length, 8) },
              1024: { slidesPerView: Math.min(list.length, 10) },
            }}
          >
            {list.map((url, i) => (
              <SwiperSlide key={`th-${url}-${i}`}>
                <ThumbImg
                  src={url}
                  alt={`Thumb ${i + 1}`}
                  loading="lazy"
                  draggable={false}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </ThumbSlider>
      )}

      {/* Fullscreen lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Counter]}
        zoom={{ maxZoomPixelRatio: 3 }}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
        animation={{ fade: 250, swipe: 300 }}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.92)' },
        }}
        on={{
          view: ({ index }) => {
            // Sync main slider when user navigates in lightbox
            if (mainSwiperRef.current && index !== mainSwiperRef.current.realIndex) {
              mainSwiperRef.current.slideToLoop(index);
            }
          },
        }}
      />
    </Wrap>
  );
}
