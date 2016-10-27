/*  ==========================================================================
    Variables
    ========================================================================== */

const LEADERBOARD_TABLE_PAGES_COUNT = 5;
const LEADERBOARD_PAGES_NAVIGATION_COUNT = 3;

/*  ==========================================================================
    Next & Previous Page Arrows
    ========================================================================== */

function onPreviousLeaderboardTablePageClick() {
    if (leaderboardTableConfig.currentPage - 1 <= 0) {
        return;
    }

    leaderboardTableConfig.currentPage -= 1;
    refreshLeaderboardTablePageNumbers();
    refreshLeaderboardTable();
}

function onNextLeaderboardTablePageClick() {
    if (leaderboardTableConfig.currentPage + 1 > leaderboardTableConfig.totalPages) {
        return;
    }

    leaderboardTableConfig.currentPage += 1;
    refreshLeaderboardTablePageNumbers();
    refreshLeaderboardTable();
}

/*  ==========================================================================
    Page Number Click
    ========================================================================== */

function onLeaderboardTablePageNumberClick() {
    const clickedPageNumber = Number($(this).text());

    if (isNaN(clickedPageNumber)) {
        return;
    }

    leaderboardTableConfig.currentPage = clickedPageNumber;
    refreshLeaderboardTablePageNumbers();
    refreshLeaderboardTable();
}

/*  ==========================================================================
    Load Page Numbers
    ========================================================================== */

function refreshLeaderboardTablePageNumbers() {
    const ACTIVE_CLASS = 'active';
    const PAGE_NUMBER_ATTRIBUTE = 'page-number';
    const DISABLED_CLASS = 'disabled';
    const ELLIPSIS_TEXT = '...';

    const $pageNumbers = $('.leaderboard-card .pagination .page-number');
    const $firstPageNumber = $pageNumbers.first().removeClass(ACTIVE_CLASS).removeAttr(PAGE_NUMBER_ATTRIBUTE);
    const $leftPage = $firstPageNumber.prev();
    const $rightPage = $pageNumbers.last().next();

    const numberOfPages = (leaderboardTableConfig.totalPages > LEADERBOARD_TABLE_PAGES_COUNT) ? LEADERBOARD_TABLE_PAGES_COUNT : leaderboardTableConfig.totalPages;

    $pageNumbers.remove();

    if (leaderboardTableConfig.currentPage >= LEADERBOARD_TABLE_PAGES_COUNT) {
        // Add first page number
        $firstPageNumber.text(1);
        $firstPageNumber.attr(PAGE_NUMBER_ATTRIBUTE, 1);

        $rightPage.before($firstPageNumber);

        // Add ellipsis
        const $ellipsis = $firstPageNumber.clone();

        $ellipsis.text(ELLIPSIS_TEXT);
        $ellipsis.addClass(DISABLED_CLASS);

        $rightPage.before($ellipsis);
    }

    if (leaderboardTableConfig.currentPage < LEADERBOARD_TABLE_PAGES_COUNT) {
        // First pages
        for (let i = 0; i < numberOfPages; i++) {
            const $pageNumberElement = $firstPageNumber.clone();

            $pageNumberElement.text(i + 1);
            $pageNumberElement.attr(PAGE_NUMBER_ATTRIBUTE, i + 1);

            $rightPage.before($pageNumberElement);
        }
    } else if (leaderboardTableConfig.currentPage > (leaderboardTableConfig.totalPages - LEADERBOARD_TABLE_PAGES_COUNT) + 1) {
        // Last pages
        for (let i = leaderboardTableConfig.totalPages - LEADERBOARD_TABLE_PAGES_COUNT; i < leaderboardTableConfig.totalPages; i++) {
            const $pageNumberElement = $firstPageNumber.clone();

            $pageNumberElement.text(i + 1);
            $pageNumberElement.attr(PAGE_NUMBER_ATTRIBUTE, i + 1);

            $rightPage.before($pageNumberElement);
        }
    } else {
        // In between pages
        let startPageIndex = leaderboardTableConfig.currentPage - 1;
        const endPageIndex = startPageIndex + LEADERBOARD_PAGES_NAVIGATION_COUNT;

        for (let i = startPageIndex; i < endPageIndex; i++) {
            const $pageNumberElement = $firstPageNumber.clone();

            $pageNumberElement.text(i);
            $pageNumberElement.attr(PAGE_NUMBER_ATTRIBUTE, i);

            $rightPage.before($pageNumberElement);
        }
    }

    // Last tilda and last page
    if (leaderboardTableConfig.totalPages > LEADERBOARD_TABLE_PAGES_COUNT && leaderboardTableConfig.currentPage - 1 <= leaderboardTableConfig.totalPages - LEADERBOARD_TABLE_PAGES_COUNT) {
        const $ellipsis = $firstPageNumber.clone();

        $ellipsis.text(ELLIPSIS_TEXT);
        $ellipsis.addClass(DISABLED_CLASS);

        $rightPage.before($ellipsis);

        const $lastPageNumber = $firstPageNumber.clone();

        $lastPageNumber.text(leaderboardTableConfig.totalPages);
        $lastPageNumber.attr(PAGE_NUMBER_ATTRIBUTE, leaderboardTableConfig.totalPages);

        $rightPage.before($lastPageNumber);
    }

    $(`.leaderboard-card .pagination .page-number[page-number="${leaderboardTableConfig.currentPage}"]`).addClass(ACTIVE_CLASS);
}