-- Pull in the wezterm API
local wezterm = require 'wezterm'

-- This will hold the configuration.
local config = wezterm.config_builder()

-- This is where you actually apply your config choices

local function Add_background()
    config.window_background_image = 'D:\\wallpapers\\AnimeStyle\\1333741.png'
    config.window_background_image_hsb = {
        -- Darken the background image by reducing it to 1/3rd
        brightness = 0.3,

        -- You can adjust the hue by scaling its value.
        -- a multiplier of 1.0 leaves the value unchanged.
        hue = 1.0,

        -- You can adjust the saturation also.
        saturation = 1.0,
    }
end


local function Add_theme(config)
    config.color_scheme = 'Catppuccin Macchiato'
    config.font = wezterm.font 'JetBrains Mono'
end

local function Add_retro_bar(config)
    config.use_fancy_tab_bar = false
    config.hide_tab_bar_if_only_one_tab = true
end


config.inactive_pane_hsb = {
    saturation = 0.9,
    brightness = 0.8,
}

local function Add_transparancy(config)
    config.window_background_opacity = 0.8
    config.text_background_opacity = 1.0
end

local function Add_defaults()
    config.default_cwd = "/some/path"
    -- Spawn a fish shell in login mode
    config.default_prog = { '/usr/local/bin/fish', '-l' }
end

local function Add_launch_options(config)
    config.launch_menu = {
        {
            -- Optional label to show in the launcher. If omitted, a label
            -- is derived from the `args`
            label = 'WSL',
            -- The argument array to spawn.  If omitted the default program
            -- will be used as described in the documentation above
            args = { 'bash', '-l' },

            -- You can specify an alternative current working directory;
            -- if you don't specify one then a default based on the OSC 7
            -- escape sequence will be used (see the Shell Integration
            -- docs), falling back to the home directory.
            -- cwd = "/some/path"

            -- You can override environment variables just for this command
            -- by setting this here.  It has the same semantics as the main
            -- set_environment_variables configuration option described above
            -- set_environment_variables = { FOO = "bar" },
        },
        {
            label = 'Cmd',
            args = { 'cmd' }
        },
        {
            label = 'Git Bash',
            args = { 'C:\\Program Files\\Git\\bin\\sh.exe', '--login' }
        },
        {
            label = 'PowerShell',
            args = { 'powershell.exe', '-NoLogo' },
        }
    }
    config.keys = {
        { key = 'w', mods = 'CTRL', action = wezterm.action.CloseCurrentTab { confirm = false } },
        { key = 'l', mods = 'CTRL', action = wezterm.action.ShowLauncherArgs { flags = 'LAUNCH_MENU_ITEMS|FUZZY' } },
    }
end

Add_launch_options(config)
Add_theme(config)
Add_transparancy(config)
Add_retro_bar(config)

-- and finally, return the configuration to wezterm
return config
