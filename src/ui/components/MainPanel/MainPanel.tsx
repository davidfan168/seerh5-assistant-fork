import { Lock } from '@mui/icons-material';
import { Box, Fade, Switch, SxProps, Tab, Tabs } from '@mui/material';
import { PanelStateContext } from '@sa-ui/context/PanelState';
import { mainColor } from '@sa-ui/style';
import * as React from 'react';
import { BattleManager } from './BattleManager';
import { CommonValue } from './CommonValue';
import { PackageCapture } from './PackageCapture';
import { PetBag } from './PetBag';
import { QuickCommand } from './QuickCommand/QuickCommand';
import { Realm } from './Realm';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps & { sx?: SxProps }) {
    const { sx, children, value, index, ...other } = props;

    return (
        <Box
            sx={{
                p: 1,
                width: '100%',
                overflow: 'auto',
                marginRight: '-1px',
                '&::-webkit-scrollbar': {
                    width: 8,
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: `rgba(${mainColor.front} / 16%)`,
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: `rgba(${mainColor.front} / 90%)`,
                },
                ...sx,
            }}
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

interface Props {
    show: boolean;
    lock: boolean;
    setLock: (lock: boolean) => void;
}

export function MainPanel(props: Props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function dispatchClickEvent(e: React.TouchEvent | React.MouseEvent) {
        if (!props.lock) {
            return;
        }
        const canvas: HTMLCanvasElement = document.querySelector('#egret_player_container canvas')!;
        const eventProperty: any = {};
        for (let k in e.nativeEvent) {
            eventProperty[k] = e.nativeEvent[k as keyof typeof e.nativeEvent];
        }
        if (e.nativeEvent instanceof MouseEvent) {
            canvas.dispatchEvent(new MouseEvent(e.type, eventProperty));
        } else if (e.nativeEvent instanceof TouchEvent) {
            canvas.dispatchEvent(new TouchEvent(e.type, eventProperty));
        }
    }

    return (
        <Fade in={props.show}>
            <Box
                sx={{
                    position: 'absolute',
                    display: 'flex',
                    top: '12vh',
                    left: 'calc((100vw - 60vw) / 2)',
                    width: '60vw',
                    height: '75vh',
                    zIndex: 1,
                    color: `rgba(${mainColor.front} / 100%)`,
                    bgcolor: `rgba(${mainColor.back} / 35%)`,
                    border: `2px solid rgba(${mainColor.front} / 75%)`,
                    backdropFilter: `blur(8px)`,
                    boxShadow: `0 0 16px rgba(${mainColor.front} / 50%),
                    0 0 16px rgba(${mainColor.back} / 50%) inset`,
                }}
                onClick={(e) => {
                    e.nativeEvent.stopPropagation();
                }}
                onTouchCancel={dispatchClickEvent}
                onTouchStart={dispatchClickEvent}
                onTouchEnd={dispatchClickEvent}
                onMouseUp={dispatchClickEvent}
                onMouseDown={dispatchClickEvent}
            >
                <Box
                    sx={{
                        minWidth: '155px',
                        bgcolor: `rgba(${mainColor.back} / 12%)`,
                        borderRight: 1,
                        // backdropFilter: `blur(8px)`,
                        borderColor: 'rgba(255 255 255 / 12%)',
                        paddingBlockStart: '10%',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock />
                        <Switch
                            checked={props.lock}
                            onChange={(e, newValue) => {
                                props.setLock(newValue);
                            }}
                        />
                    </Box>

                    <Tabs orientation="vertical" value={value} onChange={handleChange} aria-label="SA Main Panel Tabs">
                        <Tab label="快捷命令组" {...a11yProps(0)} />
                        <Tab label="常用数据速览" {...a11yProps(1)} />
                        <Tab label="一键日常" {...a11yProps(2)} />
                        <Tab label="精灵背包" {...a11yProps(3)} />
                        <Tab label="自动战斗管理器" {...a11yProps(4)} />
                        <Tab label="抓包调试" {...a11yProps(5)} />
                    </Tabs>
                </Box>
                <PanelStateContext.Consumer>
                    {(panelState) => (
                        <>
                            <TabPanel value={value} index={0}>
                                <QuickCommand />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <CommonValue panelState={panelState} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <Realm />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <PetBag panelState={panelState} />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <BattleManager />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <PackageCapture />
                            </TabPanel>
                        </>
                    )}
                </PanelStateContext.Consumer>
            </Box>
        </Fade>
    );
}
