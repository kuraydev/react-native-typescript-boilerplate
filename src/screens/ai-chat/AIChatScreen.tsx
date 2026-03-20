import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import fonts from "@fonts";
import RNBounceable from "@freakycoder/react-native-bounceable";
import { useAIChat } from "@hooks";
import { AI_PROVIDER_LABELS } from "@services/ai";
import type { AIConfig, AIMessage, AIProvider } from "@services/ai/types";
import RNAIMessage from "@shared-components/ai-message/RNAIMessage";
import Text from "@shared-components/text-wrapper/TextWrapper";
import createStyles from "./AIChatScreen.style";

// ─── Constants ────────────────────────────────────────────────────────────────

const PROVIDERS: AIProvider[] = ["openai", "anthropic", "gemini"];

const PROVIDER_ICON: Record<AIProvider, string> = {
  openai: "logo-openai",
  anthropic: "sparkles",
  gemini: "diamond",
};

/** Placeholder hint shown in the model input for each provider */
const PROVIDER_MODEL_HINT: Record<AIProvider, string> = {
  openai: "e.g. gpt-4o-mini",
  anthropic: "e.g. claude-3-5-haiku-…",
  gemini: "e.g. gemini-2.0-flash",
};

/** Docs URL shown in the config panel */
const PROVIDER_DOCS_URL: Record<AIProvider, string> = {
  openai: "platform.openai.com/docs/models",
  anthropic: "docs.anthropic.com/claude/docs/models",
  gemini: "ai.google.dev/gemini-api/docs/models",
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

const TypingIndicator: React.FC<{
  styles: ReturnType<typeof createStyles>;
  primaryColor: string;
}> = ({ styles, primaryColor }) => (
  <View style={styles.typingWrapper}>
    <View style={styles.typingAvatar}>
      <Icon
        name="sparkles"
        type={IconType.Ionicons}
        size={16}
        color={primaryColor}
      />
    </View>
    <View style={styles.typingBubble}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.typingDot} />
      ))}
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

const AIChatScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // ── Config state ────────────────────────────────────────────────────────────
  const [selectedProvider, setSelectedProvider] =
    useState<AIProvider>("openai");
  const [apiKeys, setApiKeys] = useState<Partial<Record<AIProvider, string>>>(
    {},
  );
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [savedModels, setSavedModels] = useState<
    Partial<Record<AIProvider, string>>
  >({});
  const [useStreaming, setUseStreaming] = useState(true);
  const [configVisible, setConfigVisible] = useState(true);

  // ── Input state ─────────────────────────────────────────────────────────────
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const listRef = useRef<FlatList<AIMessage>>(null);

  // ── AI config ───────────────────────────────────────────────────────────────
  const currentApiKey = apiKeys[selectedProvider] ?? "";
  const currentModel = savedModels[selectedProvider] ?? "";

  const aiConfig: AIConfig = {
    provider: selectedProvider,
    apiKey: currentApiKey,
    model: currentModel,
    temperature: 0.7,
    maxTokens: 1024,
  };

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    streamMessage,
    clearMessages,
  } = useAIChat({ config: aiConfig });

  const isBusy = isLoading || isStreaming;
  const canSend =
    inputText.trim().length > 0 &&
    currentApiKey.length > 0 &&
    currentModel.length > 0 &&
    !isBusy;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    setApiKeyInput(apiKeys[provider] ?? "");
    setModelInput(savedModels[provider] ?? "");
  };

  const handleSaveConfig = () => {
    const key = apiKeyInput.trim();
    const model = modelInput.trim();
    if (!key || !model) return;
    setApiKeys((prev) => ({ ...prev, [selectedProvider]: key }));
    setSavedModels((prev) => ({ ...prev, [selectedProvider]: model }));
    setConfigVisible(false);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isBusy) return;
    setInputText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    if (useStreaming) {
      await streamMessage(text);
    } else {
      await sendMessage(text);
    }
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 150);
  };

  // ── Sub-renders ─────────────────────────────────────────────────────────────

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleBlock}>
          <View style={styles.headerIconWrap}>
            <Icon
              name="chatbubble-ellipses"
              type={IconType.Ionicons}
              size={20}
              color={colors.primary}
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Chat</Text>
            <Text style={styles.headerSubtitle}>
              {AI_PROVIDER_LABELS[selectedProvider]}
              {currentModel ? ` · ${currentModel}` : " · no model set"}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <RNBounceable
            style={styles.headerActionBtn}
            onPress={() => setConfigVisible((v) => !v)}
          >
            <Icon
              name="key"
              type={IconType.Ionicons}
              size={16}
              color={configVisible ? colors.primary : colors.placeholder}
            />
          </RNBounceable>
          <RNBounceable style={styles.headerActionBtn} onPress={clearMessages}>
            <Icon
              name="trash-outline"
              type={IconType.Ionicons}
              size={16}
              color={colors.placeholder}
            />
          </RNBounceable>
        </View>
      </View>

      {/* Provider selector */}
      <View style={styles.providerRow}>
        {PROVIDERS.map((provider) => {
          const active = provider === selectedProvider;
          return (
            <RNBounceable
              key={provider}
              style={[styles.providerPill, active && styles.providerPillActive]}
              onPress={() => handleProviderChange(provider)}
            >
              <Text
                style={[
                  styles.providerPillText,
                  active && styles.providerPillTextActive,
                ]}
              >
                {AI_PROVIDER_LABELS[provider]}
              </Text>
            </RNBounceable>
          );
        })}
      </View>

      {/* Config panel */}
      {configVisible ? (
        <View style={styles.configPanel}>
          <View style={styles.configHeader}>
            <Icon
              name={PROVIDER_ICON[selectedProvider] as string}
              type={IconType.Ionicons}
              size={16}
              color={colors.primary}
            />
            <Text style={styles.configTitle}>
              Configure {AI_PROVIDER_LABELS[selectedProvider]}
            </Text>
          </View>
          <Text style={styles.configDescription}>
            Keys stay in memory only. Find your model names at{" "}
            {PROVIDER_DOCS_URL[selectedProvider]}.
          </Text>

          {/* API key row */}
          <View style={styles.configInputRow}>
            <TextInput
              style={styles.configInput}
              placeholder="API key…"
              placeholderTextColor={colors.placeholder}
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Model name row */}
          <View style={styles.configInputRow}>
            <TextInput
              style={styles.configInput}
              placeholder={PROVIDER_MODEL_HINT[selectedProvider]}
              placeholderTextColor={colors.placeholder}
              value={modelInput}
              onChangeText={setModelInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.configSaveBtn}
              onPress={handleSaveConfig}
            >
              <Text style={styles.configSaveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Icon
          name="chatbubble-ellipses-outline"
          type={IconType.Ionicons}
          size={36}
          color={colors.primary}
        />
      </View>
      <Text fontFamily={fonts.montserrat.bold} style={styles.emptyTitle}>
        Start a conversation
      </Text>
      <Text style={styles.emptySubtitle}>
        Plug in any OpenAI-compatible, Anthropic, or Gemini model — add your API
        key and model name above to start.
      </Text>
      <View style={styles.emptyProviderList}>
        {PROVIDERS.map((p) => (
          <View key={p} style={styles.emptyProviderRow}>
            <Icon
              name={PROVIDER_ICON[p] as string}
              type={IconType.Ionicons}
              size={18}
              color={colors.primary}
            />
            <View style={styles.emptyProviderContent}>
              <Text bold color={colors.text} style={styles.emptyProviderName}>
                {AI_PROVIDER_LABELS[p]}
              </Text>
              <Text style={styles.emptyProviderHint}>
                {savedModels[p] ? savedModels[p] : PROVIDER_MODEL_HINT[p]} ·
                streaming ready
              </Text>
            </View>
            {apiKeys[p] && savedModels[p] ? (
              <Icon
                name="checkmark-circle"
                type={IconType.Ionicons}
                size={18}
                color="#10b981"
              />
            ) : (
              <Icon
                name="ellipse-outline"
                type={IconType.Ionicons}
                size={18}
                color={colors.borderColor}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const visibleMessages = messages.filter((m) => m.role !== "system");

  const renderMessage = ({
    item,
    index,
  }: {
    item: AIMessage;
    index: number;
  }) => {
    const isLastAssistant =
      item.role === "assistant" && index === visibleMessages.length - 1;
    return (
      <RNAIMessage
        message={item}
        isStreaming={isLastAssistant && isStreaming}
        showTimestamp={false}
      />
    );
  };

  const renderInputArea = () => {
    let inputPlaceholder = "Message…";
    if (!currentApiKey)
      inputPlaceholder = "Set API key + model above to start…";
    else if (!currentModel)
      inputPlaceholder = "Set a model name above to start…";

    return (
      <View style={styles.inputArea}>
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.inputBox}
            placeholder={inputPlaceholder}
            placeholderTextColor={colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            editable={!!currentApiKey && !!currentModel && !isBusy}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <RNBounceable
            style={[
              styles.sendBtn,
              canSend ? styles.sendBtnActive : styles.sendBtnDisabled,
            ]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <Icon
              name={isBusy ? "ellipsis-horizontal" : "arrow-up"}
              type={IconType.Ionicons}
              size={18}
              color={colors.white}
            />
          </RNBounceable>
        </View>
        <View style={styles.inputMeta}>
          <RNBounceable
            style={styles.streamToggle}
            onPress={() => setUseStreaming((v) => !v)}
          >
            <Icon
              name={useStreaming ? "radio-button-on" : "radio-button-off"}
              type={IconType.Ionicons}
              size={14}
              color={useStreaming ? colors.primary : colors.placeholder}
            />
            <Text style={styles.streamToggleText}>
              {useStreaming ? "Streaming on" : "Streaming off"}
            </Text>
          </RNBounceable>
          <Text style={styles.charCount}>{inputText.length}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {renderHeader()}

        {/* Error banner */}
        {error ? (
          <View style={styles.errorBanner}>
            <Icon
              name="alert-circle-outline"
              type={IconType.Ionicons}
              size={16}
              color={colors.danger}
            />
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        ) : null}

        {/* Messages */}
        {visibleMessages.length === 0 && !isBusy ? (
          renderEmpty()
        ) : (
          <FlatList
            ref={listRef}
            style={styles.messageList}
            data={visibleMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageListContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            ListFooterComponent={
              isLoading ? (
                <TypingIndicator
                  styles={styles}
                  primaryColor={colors.primary}
                />
              ) : null
            }
          />
        )}

        {renderInputArea()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AIChatScreen;
