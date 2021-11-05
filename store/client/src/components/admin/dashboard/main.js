export const showDashboard = (dashBoardRef) => {
    dashBoardRef.current.classList.add('show-dashboard');
    dashBoardRef.current.classList.remove('hide-dashboard');

    const open = document.getElementById("open-menu");
    const close = document.getElementById("close-menu");

    open.classList.add('hide-dashboard-menu')
    open.classList.remove('show-dashboard-menu')

    close.classList.add('show-dashboard-menu')
    close.classList.remove('hide-dashboard-menu')
}
export const hideDashboard = (dashBoardRef) => {
    dashBoardRef.current.classList.remove('show-dashboard');
    dashBoardRef.current.classList.add('hide-dashboard');

    const open = document.getElementById("open-menu");
    const close = document.getElementById("close-menu");

    open.classList.remove('hide-dashboard-menu')
    open.classList.add('show-dashboard-menu')

    close.classList.remove('show-dashboard-menu')
    close.classList.add('hide-dashboard-menu')
}