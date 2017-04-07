/******************************************************************************
 *
 * IMPORTANT: This file is only used for the "demo"/dev environment that is
 * set up via webpack-dev-server.  It should *NOT* be bundled into the production
 * package.
 *
 ****************************************************************************/

import CanvasPlanner from './index';

const mount_point = document.getElementById('mount_point');
CanvasPlanner.render(mount_point);
