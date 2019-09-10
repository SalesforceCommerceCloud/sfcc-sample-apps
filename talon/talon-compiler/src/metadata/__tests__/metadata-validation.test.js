import validate from '../metadata-validation';
import { startTestContext, endTestContext, updateTestContext } from 'test-talon-context';
import { vol } from 'memfs';

const errorMessage = "There was an error during validation";
const validRoutes = [
    {
        label: "My Home Route",
        name: "home",
        path: "/",
        isRoot: true,
        view: "home"
    },
    {
        label: "My Default Route",
        name: "default",
        path: "/error",
        isDefault: true,
        view: "error"
    }
];
const validTheme = {
    label: "My Theme",
    name: "theme",
    branding: "branding.json",
    themeLayouts: {
        "default": {
            view: "themeLayoutDefault"
        }
    }
};
jest.mock('../../utils/observable-folder-hash');
jest.mock('../../utils/filesystem');

beforeEach(() => {
    return startTestContext();
});

afterEach(() => {
    endTestContext();
});

describe('validate', () => {
    it('rejects with error message', async () => {
        return expect(validate()).rejects.toMatchObject({
            message: errorMessage
        });
    });

    it('doesnt reject when life is all good', async () => {
        vol.fromJSON({
            '/my/routes.json': JSON.stringify(validRoutes),
            '/my/theme.json': JSON.stringify(validTheme)
        });

        updateTestContext({ routesJson: '/my/routes.json', themeJson: '/my/theme.json' });

        await validate();
    });
});

describe('validate routes', () => {
    it('validates there is at least one root route', async () => {
        const routes = [
            {
                name: "home",
                path: "/"
            }
        ];

        vol.fromJSON({
            '/my/theme.json': JSON.stringify(validTheme),
            '/my/routes.json': JSON.stringify(routes)
        });

        updateTestContext({ themeJson: '/my/theme.json', routesJson: '/my/routes.json' });

        await validate().catch(err => {
            expectErrorsIncludes(err.errors, "One and only one root route should be defined");
        });
    });

    it('validates there is at least one default route', async () => {
        const invalidRoutes = [
            {
                name: "home",
                path: "/",
                isRoot: true
            }
        ];

        vol.fromJSON({
            '/my/theme.json': JSON.stringify(validTheme),
            '/my/routes.json': JSON.stringify(invalidRoutes)
        });

        updateTestContext({ themeJson: '/my/theme.json', routesJson: '/my/routes.json' });

        await validate().catch(err => {
            expectErrorsIncludes(err.errors, "One and only one default route should be defined");
        });
    });

    it('validates all route names are unique', async () => {
        const invalidRoutes = [
            {
                label: "Home",
                name: "home",
                path: "/",
                isRoot: true,
                view: "home"
            },
            {
                label: "About",
                name: "about",
                path: "/about",
                isDefault: true,
                view: "about"
            },
            {
                label: "About",
                name: "about",
                path: "/about",
                view: "about"
            },
        ];

        vol.fromJSON({
            '/my/theme.json': JSON.stringify(validTheme),
            '/my/routes.json': JSON.stringify(invalidRoutes)
        });

        updateTestContext({ themeJson: '/my/theme.json', routesJson: '/my/routes.json' });

        await validate().catch(err => {
            expectErrorsIncludes(err.errors, "Multiple routes found with the same name: about");
        });
    });

    it('validates all route paths are unique', async () => {
        const invalidRoutes = [
            {
                label: "Home",
                name: "home",
                path: "/",
                isRoot: true,
                view: "home"
            },
            {
                label: "About",
                name: "about",
                path: "/about",
                isDefault: true,
                view: "about"
            },
            {
                label: "About",
                name: "about2",
                path: "/about",
                view: "about"
            },
        ];

        vol.fromJSON({
            '/my/theme.json': JSON.stringify(validTheme),
            '/my/routes.json': JSON.stringify(invalidRoutes)
        });

        updateTestContext({ themeJson: '/my/theme.json', routesJson: '/my/routes.json' });

        await validate().catch(err => {
            expectErrorsIncludes(err.errors, "Multiple routes found with the same path: /about");
        });
    });
});

function expectErrorsIncludes(errors, message) {
    expect(errors).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                message
            })
        ])
    );
}