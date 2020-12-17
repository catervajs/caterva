'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">caterva documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link">AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' : 'data-target="#xs-controllers-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' :
                                            'id="xs-controllers-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' }>
                                            <li class="link">
                                                <a href="controllers/AccountController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' : 'data-target="#xs-injectables-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' :
                                        'id="xs-injectables-links-module-AccountModule-ef37934030670ad438a8055bb3e8f966"' }>
                                        <li class="link">
                                            <a href="injectables/AccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AccountService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' : 'data-target="#xs-controllers-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' :
                                            'id="xs-controllers-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' : 'data-target="#xs-injectables-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' :
                                        'id="xs-injectables-links-module-AppModule-affc1fcc2c58300d1a1ba8adc8876f90"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ExtensionsModule.html" data-type="entity-link">ExtensionsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FriendModule.html" data-type="entity-link">FriendModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' : 'data-target="#xs-controllers-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' :
                                            'id="xs-controllers-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' }>
                                            <li class="link">
                                                <a href="controllers/FriendController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FriendController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' : 'data-target="#xs-injectables-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' :
                                        'id="xs-injectables-links-module-FriendModule-e6eb54820283dbc5aa549e96b00f58cc"' }>
                                        <li class="link">
                                            <a href="injectables/FriendService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FriendService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GroupModule.html" data-type="entity-link">GroupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' : 'data-target="#xs-controllers-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' :
                                            'id="xs-controllers-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' }>
                                            <li class="link">
                                                <a href="controllers/GroupController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GroupController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' : 'data-target="#xs-injectables-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' :
                                        'id="xs-injectables-links-module-GroupModule-75a46741c0ac43a89d8ba9706c964351"' }>
                                        <li class="link">
                                            <a href="injectables/GroupService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GroupService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LeaderboardModule.html" data-type="entity-link">LeaderboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' : 'data-target="#xs-controllers-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' :
                                            'id="xs-controllers-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' }>
                                            <li class="link">
                                                <a href="controllers/LeaderboardController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeaderboardController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' : 'data-target="#xs-injectables-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' :
                                        'id="xs-injectables-links-module-LeaderboardModule-b9939fedf7693462cc890fa1f43ee511"' }>
                                        <li class="link">
                                            <a href="injectables/LeaderboardService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LeaderboardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link">ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' : 'data-target="#xs-controllers-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' :
                                            'id="xs-controllers-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' : 'data-target="#xs-injectables-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' :
                                        'id="xs-injectables-links-module-ProfileModule-4e5e1acc69aef5d058ac2258868becee"' }>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WalletModule.html" data-type="entity-link">WalletModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' : 'data-target="#xs-controllers-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' :
                                            'id="xs-controllers-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' }>
                                            <li class="link">
                                                <a href="controllers/WalletController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WalletController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' : 'data-target="#xs-injectables-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' :
                                        'id="xs-injectables-links-module-WalletModule-68a030b74122e62a9c815622e37512c2"' }>
                                        <li class="link">
                                            <a href="injectables/WalletService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WalletService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/_BaseGroupException.html" data-type="entity-link">_BaseGroupException</a>
                            </li>
                            <li class="link">
                                <a href="classes/_BaseLeaderboardException.html" data-type="entity-link">_BaseLeaderboardException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccessTokenDto.html" data-type="entity-link">AccessTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Account.html" data-type="entity-link">Account</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthDto.html" data-type="entity-link">AuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BadRequestDto.html" data-type="entity-link">BadRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BannedFromGroupError.html" data-type="entity-link">BannedFromGroupError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CannotBanError.html" data-type="entity-link">CannotBanError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CannotDeleteGroupError.html" data-type="entity-link">CannotDeleteGroupError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CannotKickError.html" data-type="entity-link">CannotKickError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CannotLeaveGroupError.html" data-type="entity-link">CannotLeaveGroupError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CouldNotUpdateLeaderboardEntryError.html" data-type="entity-link">CouldNotUpdateLeaderboardEntryError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAccountDto.html" data-type="entity-link">CreateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGroupDto.html" data-type="entity-link">CreateGroupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProfileDto.html" data-type="entity-link">CreateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorDto.html" data-type="entity-link">ErrorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Friendship.html" data-type="entity-link">Friendship</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendshipComposite.html" data-type="entity-link">FriendshipComposite</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendshipTwoWayRelationStatusDto.html" data-type="entity-link">FriendshipTwoWayRelationStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FriendshipTwoWayRelationStatusesDto.html" data-type="entity-link">FriendshipTwoWayRelationStatusesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Group.html" data-type="entity-link">Group</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupDoesNotExistError.html" data-type="entity-link">GroupDoesNotExistError</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupDto.html" data-type="entity-link">GroupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupExceptionFilter.html" data-type="entity-link">GroupExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupMember.html" data-type="entity-link">GroupMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupsDto.html" data-type="entity-link">GroupsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LeaderboardEntriesDto.html" data-type="entity-link">LeaderboardEntriesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LeaderboardEntryDto.html" data-type="entity-link">LeaderboardEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LeaderboardEntryNotFoundError.html" data-type="entity-link">LeaderboardEntryNotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/LeaderboardExceptionFilter.html" data-type="entity-link">LeaderboardExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/MembershipDto.html" data-type="entity-link">MembershipDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MembershipsDto.html" data-type="entity-link">MembershipsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotGroupAdminError.html" data-type="entity-link">NotGroupAdminError</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotGroupMemberError.html" data-type="entity-link">NotGroupMemberError</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotInvitedToGroupError.html" data-type="entity-link">NotInvitedToGroupError</a>
                            </li>
                            <li class="link">
                                <a href="classes/Profile.html" data-type="entity-link">Profile</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileAlreadyExistsError.html" data-type="entity-link">ProfileAlreadyExistsError</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProfileDto.html" data-type="entity-link">ProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReferenceFriendDto.html" data-type="entity-link">ReferenceFriendDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelfReferenceError.html" data-type="entity-link">SelfReferenceError</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelfReferenceErrorFilter.html" data-type="entity-link">SelfReferenceErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAccountDto.html" data-type="entity-link">UpdateAccountDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEntryDto.html" data-type="entity-link">UpdateEntryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGroupDto.html" data-type="entity-link">UpdateGroupDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link">UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Wallet.html" data-type="entity-link">Wallet</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link">JwtAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});