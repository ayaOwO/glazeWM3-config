/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';
import * as zebar from 'zebar';
import { createSignal, onMount } from 'solid-js';

const providers = zebar.createProviderGroup({
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu' },
  date: { type: 'date', formatting: 'EEE d MMM t' },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
  keyboard: { type: 'keyboard', refreshInterval: 300 },
});

render(() => <App />, document.getElementById('root')!);

function App() {
  const themes = ['ctp-mocha', 'ctp-macchiato', 'ctp-frappe', 'ctp-latte'];
  const [theme, setTheme] = createSignal(1);
  const [output, setOutput] = createStore(providers.outputMap);

  providers.onOutput(outputMap => setOutput(outputMap));

  // Load theme from localStorage on mount
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(themes.indexOf(savedTheme));
      document.documentElement.classList.add(savedTheme);
    }
  });



  const handleThemeSwitcher = () => {
    const newIndex = (theme() + 1) % themes.length;
    const newTheme = themes[newIndex];
    setTheme(newIndex);
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme); // Save the theme to localStorage
  };

  // Get icon to show for current network status.
  function getNetworkIcon(networkOutput) {
    switch (networkOutput.defaultInterface?.type) {
      case 'ethernet':
        return <i class="nf nf-md-ethernet_cable"></i>;
      case 'wifi':
        if (networkOutput.defaultGateway?.signalStrength >= 80) {
          return <i class="nf nf-md-wifi_strength_4"></i>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 65
        ) {
          return <i class="nf nf-md-wifi_strength_3"></i>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 40
        ) {
          return <i class="nf nf-md-wifi_strength_2"></i>;
        } else if (
          networkOutput.defaultGateway?.signalStrength >= 25
        ) {
          return <i class="nf nf-md-wifi_strength_1"></i>;
        } else {
          return <i class="nf nf-md-wifi_strength_outline"></i>;
        }
      default:
        return (
          <i class="nf nf-md-wifi_strength_off_outline"></i>
        );
    }
  }

  // Get icon to show for how much of the battery is charged.
  function getBatteryIcon(batteryOutput) {
    if (batteryOutput.chargePercent > 90)
      return <i class="nf nf-fa-battery_4"></i>;
    if (batteryOutput.chargePercent > 70)
      return <i class="nf nf-fa-battery_3"></i>;
    if (batteryOutput.chargePercent > 40)
      return <i class="nf nf-fa-battery_2"></i>;
    if (batteryOutput.chargePercent > 20)
      return <i class="nf nf-fa-battery_1"></i>;
    return <i class="nf nf-fa-battery_0"></i>;
  }

  // Get icon to show for current weather status.
  function getWeatherIcon(weatherOutput) {
    switch (weatherOutput.status) {
      case 'clear_day':
        return <i class="nf nf-weather-day_sunny"></i>;
      case 'clear_night':
        return <i class="nf nf-weather-night_clear"></i>;
      case 'cloudy_day':
        return <i class="nf nf-weather-day_cloudy"></i>;
      case 'cloudy_night':
        return <i class="nf nf-weather-night_alt_cloudy"></i>;
      case 'light_rain_day':
        return <i class="nf nf-weather-day_sprinkle"></i>;
      case 'light_rain_night':
        return <i class="nf nf-weather-night_alt_sprinkle"></i>;
      case 'heavy_rain_day':
        return <i class="nf nf-weather-day_rain"></i>;
      case 'heavy_rain_night':
        return <i class="nf nf-weather-night_alt_rain"></i>;
      case 'snow_day':
        return <i class="nf nf-weather-day_snow"></i>;
      case 'snow_night':
        return <i class="nf nf-weather-night_alt_snow"></i>;
      case 'thunder_day':
        return <i class="nf nf-weather-day_lightning"></i>;
      case 'thunder_night':
        return <i class="nf nf-weather-night_alt_lightning"></i>;
    }
  }

  function flattenWindows(windows) {
    const falttenedWindows = [];
    for (let i = 0; i < windows.length; i++) {
      if (windows[i].type === "split") {
        falttenedWindows.push(...flattenWindows(windows[i].children));
      } else {
        falttenedWindows.push(windows[i]);
      }

    }

    return falttenedWindows;
  }

  function getWindowIcon(windows) {
    const processToIcon = {
      "Code": "󰨞",
      "Spotify": "󰓇",
      "DiscordPTB": "󰙯",
      "firefox": "󰈹",
      "ApplicationFrameHost": "󰖣",
      "msedgewebview2": "󰇩",
      "msedge": "󰇩",
      "explorer": "󰉋",
      "WindowsTerminal": "",
      "default": "󰣆"
    };
    const processToClassIcon = {
      "Code": "nf-md-microsoft_visual_studio_code",
      "Spotify": "nf-md-spotify",
      "DiscordPTB": "nf-md-discord",
      "firefox": "nf-md-firefox",
      "ApplicationFrameHost": "nf-md-whatsapp",
      "msedgewebview2": "nf-md-microsoft_edge",
      "msedge": "nf-md-microsoft_edge",
      "explorer": "nf-md-folder",
      "WindowsTerminal": "nf-cod-terminal",
      "default": "nf-md-application"
    };
    const icons = [];
    const flattenedWindows = flattenWindows(windows);
    for (let i = 0; i < flattenedWindows.length; i++) {
      let processName = flattenedWindows[i].processName;
      let processIcon = processToClassIcon[processName];
      if (processIcon === undefined) {
        console.log(`Icon not found for ${processName} using default icon`);
        processIcon = processToClassIcon["default"];
      }
      icons.push(processIcon);
    }

    return (
      <>
        {icons.map((icon) => (
          <i class={`nf ${icon}`}></i>
        ))}
      </>
    );
  }

  return (
    <div class="my-2 mx-auto w-[99%] h-10 grid items-center grid-cols-3 px-2 py-1 text-ctp-text bg-gradient-to-b from-ctp-base to-ctp-surface0 rounded-lg">
      <div class="flex items-center justify-self-start">
        {output.glazewm && (
          <div class="flex items-center">
            {output.glazewm.currentWorkspaces.map(workspace => (
              <button
                class={`hover:cursor-pointer bg-ctp-surface1 hover:text-ctp-pink mr-1 py-1 px-2 overflow-hidden rounded-md ${workspace.hasFocus && 'focused text-ctp-pink'} ${workspace.isDisplayed && 'displayed'}`}
                onClick={() =>
                  output.glazewm.runCommand(
                    `focus --workspace ${workspace.name}`,
                  )
                }
              >
                {workspace.displayName ?? workspace.name}
                {workspace.isDisplayed && <i class='nf nf-md-cat'></i>}
                {getWindowIcon(workspace.children)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div class="flex items-center justify-self-center text-ctp-mauve">{output.date?.formatted}</div>

      <div class="flex items-center justify-self-end">
        {output.glazewm && (
          <>
            {output.glazewm.bindingModes.map(bindingMode => (
              <button
                class="binding-mode text-ctp-red bg-ctp-surface1"
              >
                {bindingMode.displayName ?? bindingMode.name}
              </button>
            ))}

            <button
              class={`tiling-direction text-ctp-red bg-ctp-surface1 nf ${output.glazewm.tilingDirection === 'horizontal' ? 'nf-md-swap_horizontal' : 'nf-md-swap_vertical'}`}
              onClick={() =>
                output.glazewm.runCommand('toggle-tiling-direction')
              }
            ></button>
          </>
        )}

        {output.keyboard && (
          <div class="keyboard text-ctp-peach">
            <i class="nf nf-fa-keyboard"></i>
            {output.keyboard.layout.substring(0, output.keyboard.layout.indexOf('-')).toUpperCase()}
          </div>
        )}

        {/* {output.network && (
          <div class="network">
            {getNetworkIcon(output.network)}
            {output.network.defaultGateway?.ssid}
          </div>
        )} */}

        {output.memory && (
          <div class="memory text-ctp-yellow">
            <i class="nf nf-fae-chip"></i>
            {Math.round(output.memory.usage)}%
          </div>
        )}

        {output.cpu && (
          <div class="cpu text-ctp-green">
            <i class="nf nf-oct-cpu"></i>

            {/* Change the text color if the CPU usage is high. */}
            <span
              class={output.cpu.usage > 85 ? 'high-usage text-ctp-red' : ''}
            >
              {Math.round(output.cpu.usage)}%
            </span>
          </div>
        )}

        {/* {output.battery && (
          <div class="battery"> */}
            {/* Show icon for whether battery is charging. */}
            {/* {output.battery.isCharging && (
              <i class="nf nf-md-power_plug charging-icon"></i>
            )}
            {getBatteryIcon(output.battery)}
            {Math.round(output.battery.chargePercent)}%
          </div>
        )} */}

        {output.weather && (
          <button class="weather text-ctp-sapphire" onclick={handleThemeSwitcher}>
            {getWeatherIcon(output.weather)}
            {Math.round(output.weather.celsiusTemp)}°C
          </button>
        )}
      </div>
    </div>
  );
}
