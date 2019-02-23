/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { Command, CommandContribution, CommandRegistry } from '@theia/core/lib/common/command';
import { inject, injectable } from 'inversify';
import { UriAwareCommandHandler, UriCommandHandler } from '@theia/core/lib/common/uri-command-handler';
import URI from '@theia/core/lib/common/uri';
import { SelectionService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { SelectionContext } from '../../common/selection-context';

export namespace SelectionProviderCommands {
    export const GET_SELECTED_CONTEXT: Command = {
        id: 'workspace:selectedContext',
        label: 'Get Selected Context'
    };
}

@injectable()
export class SelectionProviderCommandContribution implements CommandContribution {

    @inject(SelectionService) protected readonly selectionService: SelectionService;
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(SelectionProviderCommands.GET_SELECTED_CONTEXT, this.newMultiUriAwareCommandHandler({
            isEnabled: () => true,
            isVisible: () => true,
            execute: selectedUris => {
                const rootUris = this.workspaceService.tryGetRoots().map(root => new URI(root.uri));

                const context: SelectionContext = {
                    selectedPaths: selectedUris,
                    workspaceRoots: rootUris
                };
                return context;
            }
        }));
    }

    protected newMultiUriAwareCommandHandler(handler: UriCommandHandler<URI[]>): UriAwareCommandHandler<URI[]> {
        return new UriAwareCommandHandler(this.selectionService, handler, { multi: true });
    }
}
