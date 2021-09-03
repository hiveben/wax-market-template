// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import cn from "classnames";

const sliderContent = [{
  background: '//assets.yoshidrops.com/public/promos/LAYA Banner.jpg',
  headline: 'Music Market',
  subline: 'This is an awesome subline',
  btnContent: 'Take me there',
  btnURL: '/market'
}, {
  background: '//assets.yoshidrops.com/public/promos/yoshi_hero1.jpg',
  headline: 'Get your Music Here',
  subline: 'Learn more about our mission',
  BtnContent: '',
  BtnURL: '/explorer'
}];

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={0}
      slidesPerView={1}
      className={cn('h-auto sm:80 md:h-96 z-50')}
    >
      { sliderContent.map(slide => 
        <SwiperSlide className={cn('w-full h-full')}>
          <div className={cn(
            'relative md:absolute h-60 sm:80 md:h-auto md:inset-0',
            'bg-cover bg-center bg-no-repeat',
          )} style={{  
            backgroundImage: `url('${slide.background}')`
          }}></div>

          <div className={cn('container mx-auto h-full relative')}>
            <div className={cn(
              'relative md:absolute -mt-10 left-0 bottom-0 w-full md:w-1/2 lg:w-1/3',
              'bg-page pt-4 md:pt-6 pb-3 md:pb-10 px-6 md:px-8',
            )}>
              <h4 className={cn('text-xl md:text-3xl font-bold mb-3 leading-snug uppercase')}>{slide.headline}</h4>
              <p className={cn('text-base md:text-md mb-3 font-normal')}>{slide.subline}</p>
              
              { (slide.btnURL && slide.btnContent) &&
                <Link href={slide.btnURL}>
                    <a className={cn('button')}>{slide.btnContent}</a>
                </Link>
              }
            </div>
          </div>
        </SwiperSlide>
      ) }
    </Swiper>
  );
};