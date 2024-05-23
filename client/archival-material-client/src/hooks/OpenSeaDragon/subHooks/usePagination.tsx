import { useState } from "react";
import { useParams } from "react-router-dom";
import useArchivalRecordSelector from "../../../store/archivalRecord/hooks/archivalRecordSelectorHook";
import logger from "../../../utils/loggerUtil";
import useKeyboardShortcut from "../../useKeyboardShortcut/useKeyboardShortcut";



export default function usePagination(viewer: any){

    const archivalRecordSelector = useArchivalRecordSelector();


    const scanIndex  = Number(useParams().scanIndex);
    const [pageIndex, setPageIndex] = useState<number>(scanIndex - 1);
    const [prevPageIndex, setPrevPageIndex] = useState<number>(scanIndex);

    function previousPage() {
        if (viewer != undefined) {
            if (viewer.currentPage() > 0) {

                viewer.goToPage(viewer.currentPage() - 1)
            }
        }
    }

    function nextPage() {
        if (viewer != undefined) {
            if (archivalRecordSelector.detail?.scans?.length != undefined) {
                if (viewer.currentPage() < (archivalRecordSelector.detail.scans.length - 1)) {
                    viewer.goToPage(viewer.currentPage() + 1)
                }
            }
        }
    }

    function goToPage(pageNumber:number) {
        if (viewer !== undefined && pageNumber !== undefined && pageNumber >= 0) {
          const totalPages = archivalRecordSelector.detail?.scans?.length || 0;
          if (pageNumber < totalPages) {
            
            
            viewer.goToPage(pageNumber);
          } else {
            logger.warn("Invalid page number. Page number cannot be greater than the total number of pages.");
          }
        } else {
            logger.warn("Invalid function call. Ensure viewer and pageNumber are defined and positive.");
        }
      }

      
    useKeyboardShortcut('ArrowLeft', previousPage);
    useKeyboardShortcut('ArrowRight', nextPage);

    return {
        previousPage,
        nextPage,
        goToPage,
        setPrevPageIndex,
        setPageIndex,
        pageIndex,
        prevPageIndex
    }
}