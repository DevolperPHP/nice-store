import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel'
import '../../style/parts/slider.css'
export default function Slider() {
    return (
        <section className="slider-section">
            <Carousel style={{width:'1000px' , height:'400px' , overflow:'hidden' , borderRadius:'4px'}}>
                <Carousel.Item interval={800}>
                    <img
                        className="d-block"
                        src="/images/4cc2cc3b-6bdd-4d9c-a382-f6e76d797b6e-arduino.png"
                        alt="First slide"
                        style={{width:'100%' , height:'400px'}}
                        loading="lazy"
                    />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={500}>
                    <img
                        className="d-block"
                        src="/images/4cc2cc3b-6bdd-4d9c-a382-f6e76d797b6e-arduino.png"
                        alt="Second slide"
                        style={{width:'100%' , height:'400px'}}
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block"
                        src="/images/4cc2cc3b-6bdd-4d9c-a382-f6e76d797b6e-arduino.png"
                        alt="Third slide"
                        style={{width:'100%' , height:'400px'}}
                    />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </section>
    )
}
