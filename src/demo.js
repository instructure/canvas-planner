/******************************************************************************
 *
 * IMPORTANT: This file is only used for the "demo"/dev environment that is
 * set up via webpack-dev-server.  It should *NOT* be bundled into the production
 * package.
 *
 ****************************************************************************/

import 'instructure-ui/lib/themes/canvas';
import CanvasPlanner from './index';

const header_mount_point = document.getElementById('header_mount_point');
CanvasPlanner.renderHeader(header_mount_point);

const mount_point = document.getElementById('mount_point');
CanvasPlanner.render(mount_point);
