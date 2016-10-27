/*  ==========================================================================
    Variables
    ========================================================================== */

const ACSENDING_CLASS = 'ascending';
const DESCENDING_CLASS = 'descending';

const ROWS_PER_PAGE = 10;

const leaderboardTableConfig = {
    currentPage: 1,
    rowsPerPage: ROWS_PER_PAGE
};

/*  ==========================================================================
    Leaderboard Entry Point
    ========================================================================== */

function mountStoreLeaderboardTable() {
    const $storeLeaderboardTable = $('.store-loaderboard-table');
    $storeLeaderboardTable.find('.table-head th').click(onStoreLeaderboardTableHeadClick);
    $storeLeaderboardTable.find('.pagination .item.previous-page').click(onPreviousLeaderboardTablePageClick);
    $storeLeaderboardTable.find('.pagination .item.next-page').click(onNextLeaderboardTablePageClick);

    $(document).on('click', '.leaderboard-card .table-body .star.icon', onStoreLeaderboardTableStarIconClick);
    $(document).on('click', '.leaderboard-card .pagination .page-number:not(.disabled)', onLeaderboardTablePageNumberClick);

    refreshLeaderboardTable();
}

/*  ==========================================================================
    Table Logic
    ========================================================================== */

function setStoreLeaderboardTableData(storeLeaderboardData) {
    leaderboardTableConfig.data = storeLeaderboardData;
    leaderboardTableConfig.totalPages = Math.ceil(storeLeaderboardData.length / leaderboardTableConfig.rowsPerPage);

    refreshLeaderboardTable();
    hideStoreLeaderboardLoader();
}

function refreshLeaderboardTable() {
    const startIndex = ((leaderboardTableConfig.currentPage * leaderboardTableConfig.rowsPerPage) - leaderboardTableConfig.rowsPerPage);
    const endIndex = startIndex + leaderboardTableConfig.rowsPerPage;

    const $storeLeadberboardTable = $('.store-loaderboard-table');
    $storeLeadberboardTable.find('tbody tr:not(.hidden)').remove();

    for (let i = startIndex; i < endIndex ; i++) {
        const store = leaderboardTableConfig.data[i];

        const $storeLeadberboardTableRow = $storeLeadberboardTable.find('tbody tr.hidden').clone().removeClass('hidden');
        const $storeLeaderboardTableBody = $storeLeadberboardTable.find('tbody');

        $storeLeadberboardTableRow.find('.rank-td').text(store.rank);
        $storeLeadberboardTableRow.find('.loyalty-score-td').text(store.loyalty);
        $storeLeadberboardTableRow.find('.store-id-td .value').text(`Store ${store.id}`);
        $storeLeadberboardTableRow.find('.store-id-td a').attr('href', `https://demo.cintric.com/place/${store.id}`);
        $storeLeadberboardTableRow.find('.visit-diff-td .value').text(`${prefixPositiveNegativeNumber(store.visit_diff.toFixed(0))}%`);
        $storeLeadberboardTableRow.find('.store-reach-td').text(`${metersToMiles(store.store_reach)} miles`);

        if (store.visit_diff > 0) {
            $storeLeadberboardTableRow.find('.visit-diff-td .arrow.down').remove();
        } else {
            $storeLeadberboardTableRow.find('.visit-diff-td .arrow.up').remove();
        }

        $storeLeaderboardTableBody.append($storeLeadberboardTableRow);
    }

    refreshLeaderboardTablePageNumbers();
}

/*  ==========================================================================
    Sorting Logic
    ========================================================================== */

function onStoreLeaderboardTableHeadClick() {
    // Make sure column is sortable
    if (!$(this).attr('sort-key')) {
        return;
    }

    const sortKey = $(this).attr('sort-key');

    let sortDirection;

    $(this).siblings().removeAttr('class');

    if ($(this).hasClass(DESCENDING_CLASS)) {
        $(this).removeAttr('class');
        $(this).addClass(`sorted ${ACSENDING_CLASS}`);

        sortDirection = ACSENDING_CLASS;
    } else {
        $(this).removeAttr('class');
        $(this).addClass(`sorted ${DESCENDING_CLASS}`);

        sortDirection = DESCENDING_CLASS;
    }

    leaderboardTableConfig.data = leaderboardTableConfig.data.sortBy(sortKey, sortDirection);
    leaderboardTableConfig.currentPage = 1;

    refreshLeaderboardTable();
}

/*  ==========================================================================
    Favoriting Row
    ========================================================================== */

function onStoreLeaderboardTableStarIconClick() {
    const EMPTY_CLASS = 'empty';

    if ($(this).hasClass(EMPTY_CLASS)) {
        $(this).removeClass(EMPTY_CLASS);
    } else {
        $(this).addClass(EMPTY_CLASS);
    }
}