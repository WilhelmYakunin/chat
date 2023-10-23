import Router from './router';

import Modal from '../components/modal/modal';
import ChatSettings from '../components/chatSettings/chatSettings';
import Loader from '../components/loader/loader';

const router = new Router('app');
router.addModal(Modal);
router.addModal(ChatSettings);
router.addSuspense(Loader);

export default router;
