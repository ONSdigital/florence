import Layout from '../global/Layout'
import Collections from '../collections/Collections';
import Login from '../login/Login';

export default [
    { component: Layout },
    { path: "/florence", component: Collections },
    { path: "/florence/collections", component: Collections },
    { path: '/florence/login', component: Login },
    // { path: '/collections', component: Collections },
    // { path: '/collections/:id', component: CollectionDetails }
]
