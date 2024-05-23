import { useEffect, useState } from "react";
import logger from "../../utils/loggerUtil";
import { useOpenSeadragonContext } from "../../context/OpenSeadragonContext";
import { canvas } from "leaflet";
import defaultFilterValues from "../../configs/defaultFilterValues";




export const useOpenSeadragonFilters = () => {

    
    const {viewer } = useOpenSeadragonContext();


    const [brightness, _setBrightness] = useState<number>(defaultFilterValues.BRIGHTNESS);
    const [contrast, _setContrast] = useState<number>(defaultFilterValues.CONTRAST);
    const [saturation, _setSaturation] = useState<number>(defaultFilterValues.SATURATION);
    const [hueRotation, _setHueRotation] = useState<number>(defaultFilterValues.HUE_ROTATION);
    const [grayscale, _setGrayscale] = useState<number>(defaultFilterValues.GRAYSCALE);
    const [invert, _setInvert] = useState<number>(defaultFilterValues.INVERT);
    const [sepia, _setSepia] = useState<number>(defaultFilterValues.SEPIA);

    function resetFilters(){
        _setBrightness(defaultFilterValues.BRIGHTNESS)
        _setContrast(defaultFilterValues.CONTRAST)
        _setSaturation(defaultFilterValues.SATURATION)
        _setHueRotation(defaultFilterValues.HUE_ROTATION)
        _setGrayscale(defaultFilterValues.GRAYSCALE)
        _setInvert(defaultFilterValues.INVERT)
        _setSepia(defaultFilterValues.SEPIA)
    }

    useEffect(() => {
        if (viewer != undefined) {

            const filterValue = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotation}deg) grayscale(${grayscale}%) invert(${invert}%) sepia(${sepia}%)`;
            if (viewer.canvas != undefined) {
                viewer.drawer.canvas.style.filter = filterValue
            }
        }
    }, [viewer, brightness, contrast, saturation, hueRotation, grayscale, invert, sepia])


    function setBrightness(newValue: any){
        if (typeof newValue === 'number') {
            _setBrightness(newValue);
        } else {
            logger.error('Invalid brightness value. Please provide a number.');
        }
    }

    function setContrast(newValue: any){
        if (typeof newValue === 'number') {
            _setContrast(newValue);
        } else {
            logger.error('Invalid contrast value. Please provide a number.');
        }
    }

    function setSaturation(newValue: any){
        if (typeof newValue === 'number') {
            _setSaturation(newValue);
        } else {
            logger.error('Invalid saturation value. Please provide a number.');
        }
    }

    function setHueRotation(newValue: any){
        if (typeof newValue === 'number') {
            _setHueRotation(newValue);
        } else {
            logger.error('Invalid hue rotation value. Please provide a number.');
        }
    }

    function setGrayscale(newValue: any){
        if (typeof newValue === 'number') {
            _setGrayscale(newValue);
        } else {
            logger.error('Invalid grayscale value. Please provide a number.');
        }
    }

    function setInvert(newValue: any){
        if (typeof newValue === 'number') {
            _setInvert(newValue);
        } else {
            logger.error('Invalid invert value. Please provide a number.');
        }
    }

    function setSepia(newValue: any){
        if (typeof newValue === 'number') {
            _setSepia(newValue);
        } else {
            logger.error('Invalid sepia value. Please provide a number.');
        }
    }


    return { 
        brightness,
        setBrightness,
        contrast,
        setContrast,
        saturation,
        setSaturation,
        hueRotation,
        setHueRotation,
        grayscale,
        setGrayscale,
        invert,
        setInvert,
        sepia,
        setSepia,
        resetFilters
    }
}